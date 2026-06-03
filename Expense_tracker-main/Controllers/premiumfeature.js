const User = require('../models/users');
const Expense = require('../models/expenses');
const sequelize = require('../util/database');
const express = require('express');
const Sequelize = require('sequelize');

const getUserLeaderBoard = async (req, res) => {
    try{
        const leaderboardofusers = await User.findAll({
            order:[['totalExpenses', 'DESC']]

        })
    res.json(leaderboardofusers);
} catch (err){
    console.log(err)
    res.status(500).json(err)
}
}


const fetchmonthlydata = async (req, res) => {
  console.log("req.user",req);
  const userId = req.user.dataValues.id;

  try {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();

    const monthlydata = await Expense.findAll({
      attributes: [
        [
          Sequelize.fn("DATE", Sequelize.col("createdAt")),
          "date",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("expenseamount")),
          "totalExpense",
        ],
      ],

      where: {
        userId: userId,
        createdAt: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },

      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],

      order: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"],
      ],
    });

    res.status(200).json(monthlydata);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const addIncome=async(req,res)=>{
  try{
  const {income}=req.body;
  const id=req.user.id;
  await User.update({totalIncome:income},{where:{id:id}});
  res.status(201).json({message:"Total monthly uncome has been updated"});
  }
  catch(err){
    console.log(err);
    res.status(50).json(err);
  }
}
module.exports = {
    getUserLeaderBoard,fetchmonthlydata,addIncome
}