const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
    genre: {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    subGenre: {
        type: Schema.Types.ObjectId,
        ref: 'SubGenre',
        required: true,
    },
    contributor: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    lastUpdate: {
        type: Date,
        default: Date.now,
    },
});