import { User } from "../model/userModel.js";
import { Product } from "../model/productModel.js";

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: productId, quantity } = req.body;

    const qty = Number(quantity) || 1;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < 1 || product.stock < quantity) {
      return res.status(404).json({ message: "stock not available" })
    }
    // buyer = seller  ? checking
    if (user.role === "seller") {
      const isOwner = user.products.some((el) =>
        el._id.equals(productId)
      );

      if (isOwner) {
        return res.status(400).json({ message: "You own the product" });
      }
    }

    // Check item already exists
    const existingItem = user.cart.find((item) =>
      item.product.equals(productId)
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      user.cart.push({
        product: productId,
        quantity: qty,
      });
    }

    //remove the stock 1 or by quantity
    product.stock -= quantity

    await product.save();
    await user.save();


    return res.status(200).json({
      message: "Product added to cart",
      cart: user.cart,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Populate product inside cart
    const user = await User.findById(userId).populate("cart.product");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format cart data
    const cartItems = user.cart.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images[0]?.name || "",
      quantity: item.quantity,
      subtotal: item.quantity * item.product.price,
    }));

    // Calculate total price
    const totalPrice = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

    res.status(200).json({
      message: "Cart fetched successfully",
      data: {
        items: cartItems,
        totalItems: cartItems.length,
        totalPrice,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Remove Item
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params; // This is the Product ID
    const { quantity } = req.body
    const userId = req.user.id;

    /*
    const user = await User.findById(userId);
    // Mongoose arrays have a special .pull() method
    user.cart.pull({ product: id }); 
    await user.save();
     */
    const product = await Product.findById(id)

    product.stock += quantity
  

    // Use findByIdAndUpdate with $pull to remove the item in one database call
    // This is much faster than fetching the user, looping, and saving.
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { cart: { product: id } },
      },
      { new: true }, // Returns the updated document
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    
    await product.save()
    await user.save()

    res.json({
      success: true,
      message: "Product removed from cart",
      cartCount: user.cart.length,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
