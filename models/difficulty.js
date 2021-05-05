const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DifficultySchema = new Schema({
    difficulty = {type: String, required: true}
});

DifficultySchema.virtual("url").get(function () {
    return "catalog/difficulty/" + this._id;
})

module.exports = mongoose.model("Difficulty", DifficultySchema);