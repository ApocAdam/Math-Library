const Book = require("../models/book");
const Author = require("../models/author")
const Field = require("../models/field")
const Difficulty = require("../models/difficulty")
const Publisher = require("../models/publisher")


const async = require("async")

const {body, validationResult} = require("express-validator");

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

exports.book_create_get = function(req, res, next) {
    async.parallel({
        authors: function(callback) {
            Author.find(callback)
        },
        fields: function(callback) {
            Field.find(callback)
        },
        difficultys: function(callback) {
            Difficulty.find(callback)
        },
        publishers: function(callback) {
            Publisher.find(callback)
        }

    }, function(err, results) {
        if (err) {return next(err)}
        res.render("bookForm", {title: "Create Book", authors: results.authors, fields: results.fields, difficultys: results.difficultys, publishers: results.publishers})
    })
}

exports.book_create_post = [

    // Validate and sanitise fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        console.log(req)

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            field: req.body.field,
            difficulty: req.body.difficulty,
            publisher: req.body.publisher
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback)
                },
                fields: function(callback) {
                    Field.find(callback)
                },
                difficultys: function(callback) {
                    Difficulty.find(callback)
                },
                publishers: function(callback) {
                    Publisher.find(callback)
                }
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('bookForm', { title: "Create Book", authors: results.authors, fields: results.fields, difficultys: results.difficultys, publishers: results.publishers, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(book.url);
                });
        }
    }
];