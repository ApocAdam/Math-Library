const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: {type: String, required: true},
    author: [{type: Schema.Types.ObjectId, required: true, ref: "Author"}],
    summary: {type: String},
    field: {type: Schema.Types.ObjectId, required: true, ref: "Field"},
    difficulty: {type: Schema.Types.ObjectId, required: true, ref: "Difficulty"},
    publisher: {type: Schema.Types.ObjectId, ref: "Publisher"}
});


BookSchema.virtual("url").get(function () {
    return "catalog/book/" + this._id;
})

module.exports = mongoose.model("Book", BookSchema);