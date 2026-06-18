import express from "express";
import upload from "../utils/storage.js";
import {myProduct, createProduct ,editProduct ,deleteProduct ,getAllProducts, searchProduct, productDetail , searchresult , getRecentSearches } from "../controller/productController.js";
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
router.get('/search',searchProduct) //GET /api/products/search?q=laptop (serach recommendation)
router.get('/result/:productname',searchresult)
router.get('/details/:id', productDetail);
router.get('/recentsearch',varify,getRecentSearches)


export default router;
