const Author = require("../models/author");
const Book = require("../models/book")

const async = require("async")

const {body, validationResult} = require("express-validator")

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

exports.author_create_get = function(req, res, next) {
    res.render("authorForm", {title: "Create author"})
}


exports.author_create_post = [

    // Validate and sanitize fields.
    body("first_name", "First name required").trim().isLength({min: 1}).escape(),
    body("last_name", "Family name required").trim().isLength({min: 1}).escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);


        if (!errors.isEmpty()) {
            console.log("error", errors)
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('authorForm', { title: 'Create Author', author: req.body, errors: errors.array() });
            return;
        }
        else {
            console.log("no error")
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                });
            author.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(author.url);
            });
        }
    }
];

