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
    Book.find({}, "title author").populate("author").sort([["title", "ascending"]]).exec(function(err, list_books) {
        if (err) {return next(err); }
        res.render("bookList", {title: "Books", error: err, data: list_books});
    })
}

exports.book_detail = function(req, res) {
    Book.findById(req.params.id).populate("author field difficulty publisher").exec(function(err, book) {
        if (err) {return next(err); }
        res.render("bookDetail", {data: book});
    })
}