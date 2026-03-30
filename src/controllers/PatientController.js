const Patient = require("../models/Patient");
const User = require("../models/User");

// ADD PATIENT
exports.addPatient = async (req, res) => {
  try {
    // console.log(req.body)
    const patient = new Patient(req.body);
    console.log(patient);

    const savedPatient = await patient.save();

    res.status(201).json({
      success: true,
      message: "Patient added successfully",
      data: savedPatient
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error adding patient",
      error: error.message
    });

  }
};



// GET ALL PATIENTS
exports.getAllPatients = async (req, res) => {
  try {
    console.log(req.body);
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching patients",
      error: error.message
    });

  }
};



// UPDATE PATIENT
exports.updatePatient = async (req, res) => {
  try {
console.log(req.body)
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error updating patient",
      error: error.message
    });

  }
};



// DELETE PATIENT
exports.deletePatient = async (req, res) => {
  try {
console.log(req.body)
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error deleting patient",
      error: error.message
    });

  }
};



exports.completeConsultation = async (req, res) => {
  try {
console.log(req.body)
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    // Create visit object
    const visit = {
      appointmentDate: patient.appointmentDate,
      disease: patient.disease,
      notes: patient.notes
    };

    // Push to visit history
    patient.visitHistory.push(visit);

    // Mark consulted
    patient.consulted = true;

    // Clear current visit fields
    patient.appointmentDate = null;
    patient.disease = null;
    patient.notes = null;

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Consultation completed and visit saved to history",
      data: patient
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error completing consultation",
      error: error.message
    });

  }
};