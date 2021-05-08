const Difficulty = require("../models/difficulty");
const Book = require("../models/book")

const async = require("async")

exports.difficulty_list = function(req, res) {
    Difficulty.find().sort([["difficulty", "ascending"]]).exec(function(err, list_difficulties) {
        if (err) return next(err);
        res.render("difficultyList", {title: "Difficultys", error: err, data: list_difficulties})
    })
}

exports.difficulty_detail = function(req, res, next) {
    
    async.parallel({
        difficulty: function(callback) {
            Difficulty.findById(req.params.id)
              .exec(callback);
        },

        difficulty_books: function(callback) {
            Book.find({ 'difficulty': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.difficulty==null) { // No results.
            var err = new Error('difficulty not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('difficultyDetail', { difficulty: results.difficulty.difficulty, difficulty_books: results.difficulty_books } );
    });
}