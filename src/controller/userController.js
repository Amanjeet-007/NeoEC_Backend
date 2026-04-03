import { User } from "../model/userModel.js";


// Get My Profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate("wishlist")
    .populate("orders");

  res.json({ success: true, user });
};

// Update Profile
export const updateProfile = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.json({ success: true, user });
};
