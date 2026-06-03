const Expense = require("../models/expenses");
const User = require("../models/user");
const cron = require("node-cron");
const sendEmail = require("../utils/sendEmail");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};


const checkAndNotifyUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const email = user.email;
  const totalIncome = user.income || 0;

  const result = await Expense.aggregate([
    { $match: { userId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const expense = result[0]?.total || 0;

  if (totalIncome === 0) return;

  const usagePercent = (expense / totalIncome) * 100;

  if (usagePercent >= 90) {
    const message = `Your expense has crossed 90%. Total spent: ₹${expense}`;

    await sendEmail(
      email,
      "Expense Alert 🚨",
      message
    );
  }
};

cron.schedule("0 * * * *", async () => {
  try {
    const users = await User.find();

    for (const user of users) {
      await checkAndNotifyUser(user.id);
    }
  } catch (err) {
    console.error("Cron error:", err);
  }
});

