const Author = require("../models/author");
const Book = require("../models/book")

const async = require("async")

exports.author_list = function(req, res) {
    Author.find().sort([["author", "ascending"]]).exec(function(err, list_authors) {
        if (err) return next(err);
        res.render("authorList", {title: "Authors", error: err, data: list_authors})
    })
}


exports.author_detail = function(req, res, next) {
    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id)
              .exec(callback);
        },

        author_books: function(callback) {
            Book.find({ 'author': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.author==null) { // No results.
            var err = new Error('author not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('authorDetail', { author: results.author, author_books: results.author_books } );
    });
}