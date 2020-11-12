const express = require('express');
const router = express.Router();

let { accounts, users, writeJSON } = require('../data');


router.get('/transfer', function (req, res) {
    res.render('transfer')
})

router.post('/transfer', function (req, res) {
    let from = req.body.from;
    let to = req.body.to;
    let amount = parseInt(req.body.amount);

    console.log("AMOUNT:- " + amount);

    console.log("\n");
    console.log("BEFORE:");
    console.log(".SAVINGS:- " + accounts["savings"].balance);
    console.log("CHECKING:- " + accounts["checking"].balance);
    console.log("\n");

    if (from === 'savings' & to === 'checking') {
        console.log("CASE ONE\n");
        accounts["savings"].balance = accounts["savings"].balance - amount;
        accounts["checking"].balance = accounts["checking"].balance + amount;
    } else if (from === 'checking' & to === 'savings') {
        console.log("CASE TWO\n");
        accounts["checking"].balance = accounts["checking"].balance - amount;
        accounts["savings"].balance = accounts["savings"].balance + amount;
    }

    console.log("\n");
    console.log("AFTER:");
    console.log(".SAVINGS:- " + accounts["savings"].balance);
    console.log("CHECKING:- " + accounts["checking"].balance);
    console.log("\n");

    writeJSON();
    res.render('transfer', { message: "Transfer Completed" })
})

router.get('/payment', function (req, res) {
    res.render('payment', { account: accounts.credit })
})

router.post('/payment', function (req, res) {
    accounts.credit.balance = accounts.credit.balance - parseInt(req.body.amount);
    accounts.credit.available = accounts.credit.available + parseInt(req.body.amount);
    writeJSON();
    res.render('payment', { message: "Payment Successful", account: accounts.credit })
})

module.exports = router;