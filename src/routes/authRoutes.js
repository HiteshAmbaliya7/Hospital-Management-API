const express = require('express');
const router = express.Router();
// const User = require("../models/user");
// const {register } = require('./views/');

const {
  register,
  login,
  getMe,
  updateUser,
  updateUserAdmin,
  updatePassword,
  deleteUser,
  deleteUserPermanent
  ,admin,doctor
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth'); // Assuming you have auth middleware
const User = require('../models/User');
//public routes 
router.post('/register', register);
router.get("/register",protect,authorize("admin"), (req, res) => {
    res.render("register");
});
// 

router.post('/login',login);
router.get("/login", (req, res) => {
  
  res.render("login");
});
router.get("/pageadmin", (req, res) => {
  
  res.render("admin/user");
});
//protected routes
router.get('/me', getMe);
router.patch('/user/password', protect, updatePassword);
router.get("/nurse",protect,authorize('nurse','doctor','admin'), async (req, res) => {
  try {
    const patients = await User.find({"role":"petant"}).select("name"); // ONLY name

    res.render("nurse", {
      patients
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});
//doctor routes 
// router.get("/doctor",protect,authorize('doctor','admin'), doctor);

// // Admin routes
// router.get('/admin',protect,authorize('admin'),admin);
// router.get('/users',protect,authorize('admin'), async (req, res) => {
//   const users = await User.find();
//   res.render("/admin/users.ejs");
// });
// router.get('/users',protect,authorize('admin'), async (req, res) => {
//   const users = await User.find({});
//   res.json(users);
// });
// router.patch('/admin/user/:id',protect,authorize('admin'), updateUserAdmin);

// router.delete('/user/permanent/:id',protect, authorize('admin'), deleteUserPermanent);
// router.delete('/user/:id',protect,authorize('admin'),deleteUser);

// router.delete('/user/delete/:id',protect,authorize('admin'), deleteUserPermanent);
// router.patch('/user/:id', protect, authorize('admin'), updateUser);

// UPDATE role — handles POST /user/:id?_method=PATCH
// router.patch('/user/:id', async (req, res) => {
//   const { role } = req.body;
//   await User.findByIdAndUpdate(req.params.id, { role });
//   res.redirect('/admin');
// });

// SOFT DELETE — handles POST /user/:id?_method=DELETE
// router.delete('/user/:id', async (req, res) => {
//   await User.findByIdAndUpdate(req.params.id, { deleted: true });
//   res.redirect('/admin');
// });

// PERMANENT DELETE — handles POST /user/:id/permanent?_method=DELETE
// router.delete('/user/:id/permanent', async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.redirect('/admin');
// });

// Protected routes
router.get('/me', protect, getMe);

router.patch('/user/password', protect, updatePassword);

// Nurse
router.get("/nurse",
  protect,
  authorize('nurse','doctor','admin'),
  async (req, res) => {
    const patients = await User.find({ role: "patient" }).select("name");
    res.render("nurse", { patients });
  }
);

// Doctor
router.get("/doctor",
  protect,
  authorize('doctor','admin'),
  doctor
);

// Admin
router.get('/admin',
  protect,
  authorize('admin'),
  admin
);

router.get('/users',
  protect,
  authorize('admin'),
  async (req, res) => {
    const users = await User.find();
    res.render("admin/users", { users });
  }
);

// Update user
router.patch('/user/:id',
  protect,
  authorize('admin'),
  updateUserAdmin
);

// Delete (soft)
router.delete('/user/:id',
  protect,
  authorize('admin'),
  deleteUser
);

// Permanent delete
router.delete('/user/permanent/:id',
  protect,
  authorize('admin'),
  deleteUserPermanent
);
module.exports = router;