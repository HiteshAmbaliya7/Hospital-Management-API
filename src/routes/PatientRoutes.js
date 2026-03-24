const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
// const authRoutes = require("./authRoutes");

const {
  addPatient,
  getAllPatients,
  updatePatient,
  deletePatient,
  completeConsultation,
} = require("../controllers/PatientController");

// router.post("/add",authorize('admin', 'doctor', 'receptionist'), addPatient);
// router.get("/all", getAllPatients);
// router.put("/update/:id",authorize('admin', 'doctor', 'receptionist'), updatePatient);
// router.delete("/delete/:id",authorize('admin', 'doctor', 'receptionist'), deletePatient);
// router.put("/consult/:id",authorize('admin', 'doctor', 'receptionist'), completeConsultation);

router.post(
  "/add",
  protect,
  authorize("admin", "doctor", "receptionist"),
  addPatient
);

router.get(
  "/all",
  protect,
  authorize("admin", "doctor", "receptionist"),
  getAllPatients
);

router.put(
  "/update/:id",
  protect,
  authorize("admin", "doctor", "receptionist"),
  updatePatient
);

router.delete(
  "/delete/:id",
  protect,
  authorize("admin", "doctor", "receptionist"),
  deletePatient
);

router.put(
  "/consult/:id",
  protect,
  authorize("admin", "doctor"),
  completeConsultation
);
module.exports = router;
