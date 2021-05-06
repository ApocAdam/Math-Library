const author = require("../models/author");

exports.author_list = function(req, res) {
    res.send("author list");
}


exports.author_detail = function(req, res) {
    res.send("author detail" + req.params.id);
}