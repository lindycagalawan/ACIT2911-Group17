const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userid: {   
        type: mongoose.Schema.Types.Number, 
        required: true, unique: true 
    },
    uname: { 
        type: mongoose.Schema.Types.String, 
        required: true, unique: true 
    },
    password: { 
        type: mongoose.Schema.Types.String, 
        required: true
    },
});

module.exports = mongoose.model("User", UserSchema);