const Expense = require('../models/expenses');

const sequelize = require('../util/database');

const { fn, col, literal } = require('sequelize');

const express=require("express");

exports.daily = async (req,res) => {
    try{
        const daily=await Expense.findAll({
        attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('SUM', col('expenseamount')), 'total']
        ],
        group: [fn('DATE', col('createdAt'))],
        order: [ [literal('date'), 'ASC'] ]
       });
       res.json(daily);
    }
    catch(err){
        res.status(500).json(err);
    }
}
exports.monthly = async (req,res) => {
    try{
        const monthly=await Expense.findAll({
        attributes: [
        [fn('monthname', col('createdAt')), 'month'],
        [fn('SUM', col('expenseamount')), 'total']
        ],
        group: [fn('monthname', col('createdAt'))],
        order: [ [literal('month'), 'ASC'] ]
       });
       res.json(monthly);
    }
    catch(err){
        res.status(500).json(err);
    }
}
exports.yearly = async (req,res) => {
    try{
        const yearly=await Expense.findAll({
        attributes: [
        [fn('YEAR', col('createdAt')), 'year'],
        [fn('SUM', col('expenseamount')), 'total']
        ],
        group: [fn('YEAR', col('createdAt'))],
        order: [ [literal('year'), 'ASC'] ]
       });
       res.json(yearly);
    }
    catch(err){
        res.status(500).json(err);
    }
}