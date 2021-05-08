const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FieldSchema = new Schema({
    field: {type: String, required: true, maxLength: 100}
});

FieldSchema.virtual("url").get(function () {
    return "/catalog/field/" + this._id;
})

module.exports = mongoose.model("Field", FieldSchema);