const book = require("../models/book");

exports.index = function(req, res) {
    res.send("Homepage");
}

exports.book_list = function(req, res) {
    res.send("book list");
}

exports.book_detail = function(req, res) {
    res.send("book detail" + req.params.id);
}