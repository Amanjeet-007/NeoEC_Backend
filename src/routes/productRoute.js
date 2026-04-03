import express from "express";
import upload from "../utils/storage.js";
import {myProduct, createProduct ,editProduct ,deleteProduct ,getAllProducts, searchProduct, productDetail } from "../controller/productController.js";
import { varify ,isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

// sellers routes
router.get("/myproducts", varify, isSeller, myProduct);
router.post("/create", varify , isSeller, upload.array("img",4) , createProduct);
router.put("/edit/:id", varify,isSeller, editProduct);
router.delete("/delete/:id", varify , isSeller, deleteProduct);

// users
router.get("/", getAllProducts);

// for both
router.get('/search',searchProduct) //GET /api/products/search?q=laptop
router.get('/details/:id', productDetail);


export default router;
