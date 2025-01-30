const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    
    matricule: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    unite: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    kind: {
        type: String
    },
    situation: {
        type: String
    },
    service: {
        type: String
    },
    gender: {
        type: String
    },
    cc: {
        type: String
    },
    kindCC: {
        type: String
    },
    directManager: {
        type: String
    },
    manager: {
        type: String
    },
    familySituation: {
        type: String
    },
    numberOfChildren: {
        type: Number
    },
    dateOfBirth: {
        type: Date
    },
    age: {
        type: Number
    },
    hireDate: {
        type: Date
    },
    seniority: {
        type: String
    },
    fonction: {
        type: String
    },
    cin: {
        type: String
    },
    category: {
        type: String
    },
    level: {
        type: String
    },
    speciality: {
        type: String
    },
    adresse: {
        type: String
    },
    pointage: {
        type: String
    },
    
    profilePic: {
        type: String // Assuming it's a URL to the profile picture
    }
});

module.exports = mongoose.model('Employee', employeeSchema);
