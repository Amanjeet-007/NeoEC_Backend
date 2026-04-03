import { User } from "../model/userModel.js";

export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  await User.findByIdAndUpdate(req.user.id, {
    $addToSet: { wishlist: productId }
  });

  res.json({ message: "Added to wishlist" });
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.body;

  await User.findByIdAndUpdate(req.user.id, {
    $pull: { wishlist: productId }
  });

  res.json({ message: "Removed from wishlist" });
};

export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user.id).populate("wishlist");
  res.json(user.wishlist);
};
