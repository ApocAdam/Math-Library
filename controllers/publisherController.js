const Publisher = require("../models/publisher");
const Book = require("../models/book")

const async = require("async")

const {body, validationResult} = require("express-validator")

exports.publisher_list = function(req, res) {
    Publisher.find().sort([["publisher", "ascending"]]).exec(function(err, list_publishers) {
        if (err) return next(err);
        res.render("publisherList", {title: "Publishers", error: err, data: list_publishers})
    })
}

exports.publisher_detail = function(req, res, next) {
    
    async.parallel({
        publisher: function(callback) {
            Publisher.findById(req.params.id)
              .exec(callback);
        },

        publisher_books: function(callback) {
            Book.find({ 'publisher': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.publisher==null) { // No results.
            var err = new Error('publisher not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('publisherDetail', { publisher: results.publisher.publisher, publisher_books: results.publisher_books } );
    });
}

exports.publisher_create_get = function(req, res, next) {
    res.render("publisherForm", {title: "Create publisher"})
}


exports.publisher_create_post = [
    
    body("name", "Publisher name required").trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        
        const errors = validationResult(req);

        let publisher = new Publisher({ publisher: req.body.name})

        if (!errors.isEmpty()) {
            res.render("publisherForm", {title: "Create Publisher", publisher: publisher, errors: errors.array()});
            return;
        } else {
            Publisher.findOne({ "publisher": req.body.name}).exec(function(err, found_publisher) {
                if (err) {return next(err)}
                if (found_publisher) {
                    res.redirect(found_publisher.url)
                } else {
                    publisher.save(function(err) {
                        if (err) {return next(err)}
                        res.redirect(publisher.url)
                    })
                }
            })
        }
    }
]