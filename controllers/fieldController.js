const Field = require("../models/field")

exports.field_list = function(req, res) {

    Field.find().sort([["field", "ascending"]]).exec(function(err, list_fields) {
        if (err) return next(err);
        res.render("fieldList", {title: "Fields", error: err, data: list_fields})
    })
}

exports.field_detail = function(req, res) {
    res.send("detail detail" + req.params.id);
}