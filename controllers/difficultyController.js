const difficulty = require("../models/difficulty");

exports.difficulty_list = function(req, res) {
    res.send("difficulty list");
}

exports.difficulty_detail = function(req, res) {
    res.send("difficulty detail" + req.params.id);
}