const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    body: {
        type:String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    driveLink: {
        type: String,
        default: null
    },
    resolved: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('Post', PostSchema);