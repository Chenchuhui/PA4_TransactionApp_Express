/*
  transaction.js -- Router for the ToDoList
*/
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');


/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req, res, next) => {
    if (res.locals.loggedIn) {
        next()
    } else {
        res.redirect('/login')
    }
}

// get the value associated to the key
router.get('/transaction/',
    isLoggedIn,
    async(req, res, next) => {
        const sortitem = req.query.sortBy;
        res.locals.sortBy = sortitem;
        if (!sortitem) {
            res.locals.transactions =
                await Transaction.find({ userId: req.user._id });
        } else {
            if (sortitem == "category") {
                res.locals.transactions =
                    await Transaction.find({ userId: req.user._id }).sort({ category: 1 });
            } else if (sortitem == "amount") {
                res.locals.transactions =
                    await Transaction.find({ userId: req.user._id }).sort({ amount: 1 });
            } else if (sortitem == "description") {
                res.locals.transactions =
                    await Transaction.find({ userId: req.user._id }).sort({ description: 1 });
            } else if (sortitem == "date") {
                res.locals.transactions =
                    await Transaction.find({ userId: req.user._id }).sort({ date: 1 });
            } else {
                res.locals.transactions =
                    await Transaction.find({ userId: req.user._id });
            }
        }

        res.render('transaction');
    });

router.post('/transaction',
    isLoggedIn,
    async(req, res, next) => {
        const transaction = new Transaction({
            description: req.body.description,
            amount: req.body.amount,
            category: req.body.category,
            date: req.body.date,
            userId: req.user._id
        })
        await transaction.save();
        res.redirect('/transaction');
    });

router.get('/transaction/remove/:itemId',
    isLoggedIn,
    async(req, res, next) => {
        console.log("inside /transaction/remove/:itemId")
        await Transaction.deleteOne({ _id: req.params.itemId });
        res.redirect('/transaction')
    });

router.get('/transaction/edit/:itemId',
    isLoggedIn,
    async(req, res, next) => {
        console.log("inside /todo/edit/:itemId")
        const item =
            await Transaction.findById(req.params.itemId);
        //res.render('edit', { item });
        res.locals.transaction = item;
        res.render('edit')
    });

router.post('/transaction/updateTransaction',
    isLoggedIn,
    async(req, res, next) => {
        const { transactionId, description, amount, category, date } = req.body;
        console.log("inside /transactioin/complete/:itemId");
        await Transaction.findOneAndUpdate({ _id: transactionId }, { $set: { description, amount, category, date } });
        res.redirect('/transaction')
    });

router.get('/transaction/byCategory',
    isLoggedIn,
    async(req, res, next) => {
        console.log("inside /transaction/byCategory");
        res.locals.transactions =
            await Transaction.aggregate([{
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' }
                }
            }]);
        res.render('groupby');
    });

module.exports = router;