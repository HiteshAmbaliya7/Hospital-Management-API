const { header } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    
    const { name, email, password,role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        console.log("exist");
        
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'receptionist'
    });
    
    

    // Generate token
    const token = generateToken(user._id);
    console.log(token);
    
    res.status(201).cookie({
  httpOnly: true,      // Prevents JavaScript access (XSS protection)
  secure: true,        // Only sent over HTTPS
  sameSite: 'strict',  // CSRF protection
  maxAge: 24*60*60*1000 // Cookie expiration (e.g., 24 hours)
}).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const cookie = req.cookies?.uid;
    console.log(cookie)
    
    // if(!cookie)
    // {
    //   return res.json({massage : 'no cookie found'});
    // }
    // Check if email and password provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    // console.log(isPasswordCorrect);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "1h",
});

res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax",
  secure: false // true in production
});

 res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    console.log("getme");
    let authHeader = req.headers.authorization || req.headers.Authorization;
    console.log(authHeader);
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ massage: "no token, auhorization denied " });
      }
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    console.log(user)
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Update user
// @route   PATCH /api/auth/user/:id
// @access  Private

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const { name, email, role, isActive } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }



    // If email is being updated, check if it's already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already in use' 
        });
      }
    }

    // Build update object with only provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (typeof isActive !== 'undefined') updateFields.isActive = isActive;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update user password
// @route   PATCH /api/auth/user/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide current and new password' 
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      data: {
        token
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.updateUserAdmin = async (req, res) => {
  try {
    console.log("updateuseradmin")
    const { id } = req.params;
    console.log(id);
    // 1️⃣ Check user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    console.log(user);

    // 2️⃣ Prevent admin updating himself (important)
    if (req.user && req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot update himself'
      });
    }

    // 3️⃣ Allow only specific fields to be updated
    const allowedUpdates = ['name', 'email', 'role', 'isActive'];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // 4️⃣ Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user (soft delete - deactivate)
// @route   DELETE /api/auth/user/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Soft delete - set isActive to false
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: {
        id: user._id,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete user permanently
// @route   DELETE /api/auth/user/:id/permanent
// @access  Private/Admin
exports.deleteUserPermanent = async (req, res) => {
  try {
    
    const { id } = req.params;
    console.log(req.params);
    

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Prevent user from deleting themselves
    if (req.user._id === id) {
      return res.status(400).json({ 
        success: false,
        message: 'You cannot delete your own account' 
      });
    }

    // Permanently delete user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User permanently deleted'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
exports.admin = async (req,res)=>{
  try {
    const users = await User.find().select("-password"); // hide password

    res.render("admin/users", {
      users
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
  
}
exports.doctor = async (req, res) => {
  try {
    
    const patients = await User.find({'role':'petant'});
    
    res.render("doctor/patients", {
      patients
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }

};
