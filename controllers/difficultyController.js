const Difficulty = require("../models/difficulty");

exports.difficulty_list = function(req, res) {
    Difficulty.find().sort([["difficulty", "ascending"]]).exec(function(err, list_difficulties) {
        if (err) return next(err);
        res.render("difficultyList", {title: "Difficultys", error: err, data: list_difficulties})
    })
}

exports.difficulty_detail = function(req, res) {
    res.send("difficulty detail" + req.params.id);
}