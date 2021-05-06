const field = require("../models/field")

exports.field_list = function(req, res) {
    res.send("field list");
}

exports.field_detail = function(req, res) {
    res.send("detail detail" + req.params.id);
}