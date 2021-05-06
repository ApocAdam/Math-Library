const publisher = require("../models/publisher");

exports.publisher_list = function(req, res) {
    res.send("publisher list");
}

exports.publisher_detail = function(req, res) {
    res.send("publisher detail" + req.params.id);
}