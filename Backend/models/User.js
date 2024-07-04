const mongoose= require('mongoose')

const userSchema= new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },

    roles:[{
        type: String,
        default:"General HR"

    }],
    active:{
        type: Boolean,
        default: true
    },
    
    profileImage: {
        type: String // Store image URL here
    }
})

module.exports= mongoose.model('User', userSchema)