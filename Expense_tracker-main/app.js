const express=require('express');
const app=express();
const fs=require('fs');
const path=require('path');
const morgan=require('morgan');
var cors = require('cors');
require('dotenv').config();

const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

const sequelize = require('./util/database');
const Expense = require('./models/expenses');
const Payment = require('./models/paymentModel');
const User = require('./models/users');

const login_Route=require('./routes/login');
const expenseRoutes = require('./routes/expense')
const signupRoute = require('./routes/signupbackend');
const paymentroutes=require('./routes/paymentRoutes');
const premiumcontrollerroute=require('./routes/ispremium');
const premiumfeatureRoute=require('./routes/premiumfeature');
const forgotpasswordRoute=require('./routes/forgotpassword');
const expensereportroute=require('./routes/expense_report');
const downloadRoute=require('./routes/download');
const expensereport=require('./routes/expense_report');

app.use('/expenseTracker', express.static(path.join(__dirname, 'expenseTracker')))
app.use('/password',forgotpasswordRoute);

app.use(login_Route);
app.use('/expense', expenseRoutes);
app.use(signupRoute);
app.use(paymentroutes);
app.use(premiumcontrollerroute);
app.use(premiumfeatureRoute);
app.use(downloadRoute);
app.use(expensereport);

const accessLogStream = fs.createWriteStream((path.join___dirname,'access.log'), { flags:'a'});
app.use(morgan('combined',{stream: accessLogStream}));


User.hasMany(Expense);
Expense.belongsTo(User);

// User.hasMany(Payment);
// Payment.belongsTo(User);

sequelize
.sync({ alter: true })
.then(result => {
    app.listen(process.env.PORT || 3000,()=>{
        console.log("Server is running successfully")
    });
})
.catch(err => {
    console.log("errorhere",err);
});