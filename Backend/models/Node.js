const mongoose= require('mongoose')

const Schema= new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },

    active:{
        type: Boolean,
        default: true
    }
})

module.exports= mongoose.model('User', Schema)