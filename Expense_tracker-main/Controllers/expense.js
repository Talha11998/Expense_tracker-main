const Expense = require('../models/expenses');
const User = require('../models/users');
const sequelize = require('../util/database');

const UserServices = require('../services/userservices');
const S3service = require('../services/S3services');



const downloadexpense = async (req,res) => {
    try{
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
    const expenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);
    console.log("stringifiedExpenses",stringifiedExpenses);
    const userId=req.user.id;
    const filename=`Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3service.uploadToS3(stringifiedExpenses, filename);
    res.status(200).json({fileURL, success: true});
}catch (err) {
    console.log(err);
    res.status(500).json({fileURL:'',success:false, err:err})
    }
}
const addexpense = async (req, res) => {
    const t=await sequelize.transaction();
    try{
    const { expenseamount, description, category, note } = req.body;
    console.log(req.body);
    if(expenseamount == undefined || expenseamount.length === 0 || description == undefined || description.length === 0 || category == undefined || category.length === 0 || note == undefined || note.length === 0 ){
        return res.status(400).json({success: false, message: 'Parameters missing'})
    }
    
    await Expense.create({ expenseamount, description, category, note,userId: req.user.id},{transaction:t});
     const totalExpense = Number(req.user.totalExpenses)+Number(expenseamount)
     await User.update({
        totalExpenses: totalExpense
    },{
            where:{id:req.user.id},
            transaction:t 
        });
    await t.commit();
}
catch(error){
    await t.rollback();
    return res.status(500).json({success : false, error: error})
    }
}

const getexpenses = async (req, res)=> {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE=+req.query.limit || 5 ;
    Expense.findAndCountAll({
  where: { userId: req.user.id },
  limit: ITEMS_PER_PAGE,
  offset: (page - 1) * ITEMS_PER_PAGE,
})
.then(result => {
  const totalItems = result.count;
  const expenses = result.rows;
  res.json({
    expenses,
    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
  });
})
}

const deleteexpense = async (req, res) => {
    const t=await sequelize.transaction();
    try{
    const expenseid = req.params.expenseid;
    console.log("body",req.user.id);
    if(expenseid == undefined || expenseid.length === 0){
        return res.status(400).json({success: false})
    }
    const expenserow = await Expense.findOne({where:{id:expenseid}});
    console.log("expenserow",expenserow)
    const expenseamount1=expenserow.expenseamount;
    await Expense.destroy({where: { id: expenseid, userId: req.user.id }},{transaction:t});
    const userrow = await User.findOne({where:{id:req.user.id}});
    const totalexpenses1 = userrow.totalExpenses;
    console.log("userrow",userrow);
    const totalExpense = Number(totalexpenses1)-Number(expenseamount1);
    await User.update({
        totalExpenses: totalExpense
    },{
            where:{id:req.user.id},
            transaction:t 
        });
        await t.commit();
    }catch(error) {
        await t.rollback();
        console.log(error);
        return res.status(500).json({ success: true, message: "Failed"})
    }
}

module.exports = {
    addexpense,
    getexpenses,
    deleteexpense,
    downloadexpense,
}
