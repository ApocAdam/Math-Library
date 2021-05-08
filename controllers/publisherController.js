const Publisher = require("../models/publisher");
const Book = require("../models/book")

const async = require("async")

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