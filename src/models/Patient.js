const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
    appointmentDate: {
        type: Date,
        required: true
    },
    disease: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
}, { timestamps: true });

const patientSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    pid :{
        type: Number,
        unique:true,
        required:true
    },

    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },

    age: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },

    city: {
        type: String
    },

    weight: {
        type: Number
    },

    appointmentDate: {
        type: Date
    },

    disease: {
        type: String
    },

    consulted: {
        type: Boolean,
        default: false
    },

    notes: {
        type: String
    },

    visitHistory: [visitSchema]

}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);







// for my Notes 
// {
//   "_id": "68547af9",
//   "name": "Rahul Sharma",
//   "mobileNumber": "9876543210",
//   "age": 32,
//   "gender": "Male",
//   "city": "Ahmedabad",
//   "weight": 72,
//   "appointmentDate": "2026-03-13",
//   "disease": "Fever",
//   "consulted": true,
//   "notes": "Prescribed antibiotics",
//   "visitHistory": [
//     {
//       "appointmentDate": "2026-01-10",
//       "disease": "Cold",
//       "notes": "Given paracetamol"
//     },
//     {
//       "appointmentDate": "2025-12-15",
//       "disease": "Headache",
//       "notes": "Advised rest"
//     }
//   ]
// }




// {
// "name":"Hitesh Ambaliya",
// "mobileNumber":"9876543210",
// "age":22,
// "gender":"Male",
// "city":"Ahmedabad",
// "weight":70,
// "appointmentDate":"2026-03-14",
// "disease":"Fever",
// "notes":"Take rest"
// }