const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({ extended: true }));

let accountData = fs.readFileSync(path.join(__dirname, '/json/accounts.json'), 'utf8');
let accounts = JSON.parse(accountData);

let userData = fs.readFileSync(path.join(__dirname, '/json/users.json'), 'utf8');
let users = JSON.parse(userData);

app.get('/', function (req, res) {
    res.render('index', { title: "Account Summary", accounts: accounts })
})

app.get('/savings', function (req, res) {
    res.render('account', { account: accounts.savings })
})

app.get('/checking', function (req, res) {
    res.render('account', { account: accounts.checking })
})

app.get('/credit', function (req, res) {
    res.render('account', { account: accounts.credit })
})

app.get('/profile', function (req, res) {
    res.render('profile', { user: users[0] })
})

app.get('/transfer', function (req, res) {
    res.render('transfer')
})

app.post('/transfer', function (req, res) {
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

    let accountsJSON = JSON.stringify(accounts);
    fs.writeFileSync(path.join(__dirname, '/json/accounts.json'), accountsJSON, 'utf8');
    res.render('transfer', { message: "Transfer Completed" })
})

app.get('/payment', function (req, res) {
    res.render('payment', { account: accounts.credit })
})

app.post('/payment', function (req, res) {
    accounts.credit.balance = accounts.credit.balance - parseInt(req.body.amount);
    accounts.credit.available = accounts.credit.available + parseInt(req.body.amount);
    let accountsJSON = JSON.stringify(accounts);
    fs.writeFileSync(path.join(__dirname, '/json/accounts.json'), accountsJSON, 'utf8');
    res.render('payment', { message: "Payment Successful", account: accounts.credit })
})

app.listen(3000, () => {
    console.log("PS Project Running on port http://localhost:3000");
})

