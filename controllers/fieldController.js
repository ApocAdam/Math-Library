const Field = require("../models/field")
const Book = require("../models/book")

const async = require("async")

exports.field_list = function(req, res) {

    Field.find().sort([["field", "ascending"]]).exec(function(err, list_fields) {
        if (err) return next(err);
        res.render("fieldList", {title: "Fields", error: err, data: list_fields})
    })
}

exports.field_detail = function(req, res, next) {

    async.parallel({
        field: function(callback) {
            Field.findById(req.params.id)
              .exec(callback);
        },

        field_books: function(callback) {
            Book.find({ 'field': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.field==null) { // No results.
            var err = new Error('field not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('fieldDetail', { field: results.field.field, field_books: results.field_books } );
    });

};