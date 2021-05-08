const Publisher = require("../models/publisher");

exports.publisher_list = function(req, res) {
    Publisher.find().sort([["publisher", "ascending"]]).exec(function(err, list_publishers) {
        if (err) return next(err);
        res.render("publisherList", {title: "Publishers", error: err, data: list_publishers})
    })
}

exports.publisher_detail = function(req, res) {
    res.send("publisher detail" + req.params.id);
}