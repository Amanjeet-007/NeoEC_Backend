import { info } from "console";
import { Product } from "../model/productModel.js";
import { User } from "../model/userModel.js";
import sendError from "../utils/errorHandle.js";
import { uploadFile, deleteFile } from "../utils/imagekit.js";

//GET /api/products/search?q=iph search suggestion

// sellers
export async function myProduct(req, res) {
  try {
    //get the user email (we have isSeller middleware to get the seller )
    const user = req.user;

    if (!user) {
      return res.status(400).json({ message: "user is not authenticated." });
    }
    // retreive all products created by the user
    const products = await Product.find({ seller: user.id });

    if (!products || products.length === 0) {
      return res
        .status(200)
        .json({ message: "No products found", products: [] });
    }

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products,
    });
  } catch (err) {
    console.error("Error in myProduct:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
}

// create product 
export async function createProduct(req, res) {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (user.role !== "seller") {
      return res
        .status(403)
        .json({ message: "Only sellers can create products" });
    }

    const { name, description, price, brand, stock, category, isFeatured } =
      req.body;

    //images
    const images = [];

    for (const file of req.files) {
      const uploaded = await uploadFile(file);

      images.push({
        name: uploaded.url,
        fileId: uploaded.fileId,
      });
    }

    if (!name || !price || !stock || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (user.email == "seller@test.com") {
      if (user.products.length >= 1) {
        return res.status(300).json({ message: "test account only can create one product for test" })
      }
      const newProduct = new Product({
        name,
        description,
        price,
        brand,
        images,
        stock,
        category,
        isFeatured,
        seller: user._id,
      });
      await newProduct.save();
      user.products.push(newProduct._id);
      await user.save();

      return res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
      });

    }

    const newProduct = new Product({
      name,
      description,
      price,
      brand,
      images,
      stock,
      category,
      isFeatured,
      seller: user._id,
    });

    await newProduct.save();
    user.products.push(newProduct._id);
    await user.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("Create Product Error:", err);
    sendError(500, "Internal Server Error");
  }
}

// edit product
export async function editProduct(req, res) {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated", product: updatedProduct });
  } catch (err) {
    sendError(500, "Update failed");
  }
}

// delete product
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    for (const img of product.images) {
      if (img.fileId) {
        await deleteFile(img.fileId);
      }
    }

    // delete product from DB
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    sendError(500, "Delete failed");
  }
}

// get products (All)
export async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    sendError(500, "Failed to fetch products");
  }
}

// get product by name
export async function searchProduct(req, res) {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(200).json([]);
    }

    const regex = new RegExp(
      query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    const suggestions = await Product.find({
      name: regex,
    }).limit(5)
      // .lean();

    return res.status(200).json(
      {suggestions}
    );

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Search suggestion failed",
    });

  }
}


// get Product detail
export async function productDetail(req, res) {
  try {
    const { id } = req.params
    const details = await Product.findById(id);

    return res.status(200).json({ message: "Done fetching", info: details })
  } catch (err) {
    console.log(err)
    return res.status(200).json({ message: "getting error", info: details })
  }
}

//search result
export async function searchresult(req, res) {
  try {
    const { productname } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const skip = (page - 1) * limit;

    const sortOption = req.query.sort;

    const regex = new RegExp(
      productname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    const query = {
      name: regex,
    };

    let sort = {};

    switch (sortOption) {
      case "price_asc":
        sort.price = 1;
        break;

      case "price_desc":
        sort.price = -1;
        break;

      case "best_selling":
        sort.soldCount = -1;
        break;

      default:
        sort.createdAt = -1;
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .select(
          "name price rating stock isFeatured images"
        )
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(query),
    ]);

    if (req.user?.id) {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $pull: {
            recentSearches: {
              keyword: productname,
            },
          },
        }
      );

      await User.findByIdAndUpdate(
        req.user.id,
        {
          $push: {
            recentSearches: {
              $each: [
                {
                  keyword: productname,
                },
              ],
              $position: 0,
              $slice: 10,
            },
          },
        }
      );
    }

    return res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      products,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Search result failed",
    });

  }
}

export async function getRecentSearches(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("recentSearches")
      .lean();

    return res.status(200).json({
      recentSearches: user?.recentSearches || [],
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to get searches",
    });
  }
}

