const Book = require("../models/book");
const async = require("async")

exports.index = function(req, res) {
    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback);
        }
    }, function(err, results) {
        console.log(results, err)
        res.render('index', { title: 'Math Library', error: err, data: results });
    });
};

exports.book_list = function(req, res) {
    res.send("book list");
}

exports.book_detail = function(req, res) {
    res.send("book detail" + req.params.id);
}