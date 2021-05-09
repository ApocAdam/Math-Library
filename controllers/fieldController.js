const Field = require("../models/field")
const Book = require("../models/book")

const async = require("async")

const {body, validationResult} = require("express-validator")

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

exports.field_create_get = function(req, res, next) {
    res.render("fieldForm", {title: "Create Field"})
}


exports.field_create_post = [
    
    body("name", "Field name required").trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        
        const errors = validationResult(req);

        let field = new Field({ field: req.body.name})

        if (!errors.isEmpty()) {
            res.render("fieldForm", {title: "Create Field", field: field, errors: errors.array()});
            return;
        } else {
            Field.findOne({ "field": req.body.name}).exec(function(err, found_field) {
                if (err) {return next(err)}
                if (found_field) {
                    res.redirect(found_field.url)
                } else {
                    field.save(function(err) {
                        if (err) {return next(err)}
                        res.redirect(field.url)
                    })
                }
            })
        }
    }
]