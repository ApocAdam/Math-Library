const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: true, maxLength: 100}
});

AuthorSchema.virtual("name").get(function () {
    return this.last_name + ", " + this.first_name;
})


AuthorSchema.virtual("url").get(function () {
    return "catalog/author/" + this._id;
})

module.exports = mongoose.model("Author", AuthorSchema);