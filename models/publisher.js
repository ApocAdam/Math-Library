const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublisherSchema = new Schema({
    publisher_name: {type: String, maxLength: 100}
});

module.exports = mongoose.model("Publisher", PublisherSchema);