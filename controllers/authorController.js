const Author = require("../models/author");

exports.author_list = function(req, res) {
    Author.find().sort([["author", "ascending"]]).exec(function(err, list_authors) {
        if (err) return next(err);
        res.render("authorList", {title: "Authors", error: err, data: list_authors})
    })
}


exports.author_detail = function(req, res) {
    res.send("author detail" + req.params.id);
}