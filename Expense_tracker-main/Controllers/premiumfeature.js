const User = require('../models/users');
const Expense = require('../models/expenses');
const sequelize = require('../util/database');
const express = require('express');

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

module.exports = {
    getUserLeaderBoard
}