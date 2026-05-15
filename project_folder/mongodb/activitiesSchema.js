const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    activityid: { 
        type: mongoose.Schema.Types.Number, 
        required: true, unique: true 
    },
    title: { 
        type: mongoose.Schema.Types.String, 
        required: true 
    },
    type: { 
        type: mongoose.Schema.Types.String, 
        required: true 
    },
    difficulty: { 
        type: mongoose.Schema.Types.Number, 
        required: true 
    },
    rating: { 
        type: mongoose.Schema.Types.Number, 
        required: true 
    },
    description: { 
        type: mongoose.Schema.Types.String, 
        required: true 
    },
    image: { 
        type: mongoose.Schema.Types.String, 
        required: false 
    },
    creator: {
        uname: { 
            type: mongoose.Schema.Types.String, 
            required: true 
        },
    },
});

module.exports = mongoose.model("Activity", ActivitySchema);