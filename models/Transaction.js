'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var TransactionSchema = Schema({
    description: String,
    amount: Number,
    category: String,
    date: Date,
    userId: ObjectId

});

module.exports = mongoose.model('Transaction', TransactionSchema);