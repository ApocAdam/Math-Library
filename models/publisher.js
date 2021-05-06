const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublisherSchema = new Schema({
    publisher: {type: String, required: true}
});

PublisherSchema.virtual("url").get(function () {
    return "catalog/publisher/" + this._id;
})

module.exports = mongoose.model("Publisher", PublisherSchema);