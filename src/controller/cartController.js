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
    const { id } = req.params; // Product ID
    const userId = req.user.id;

    // 1. Fetch the user first to find the item and its quantity
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Find the specific item in the cart to see how many were added
    const cartItem = userDoc.cart.find(item => item.product.toString() === id);
    
    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    // 3. Extract the quantity safely (fallback to 1 if anything goes wrong)
    const quantityToRestore = Number(cartItem.quantity) || 1;

    // 4. Fetch the product and update its stock safely
    const product = await Product.findById(id);
    if (product) {
      product.stock = (Number(product.stock) || 0) + quantityToRestore;
      await product.save();
    }

    // 5. Remove the item from the array using Mongoose's built-in .pull()
    userDoc.cart.pull({ product: id });
    await userDoc.save();

    res.json({
      success: true,
      message: "Product removed from cart",
      cartCount: userDoc.cart.length,
    });

  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
