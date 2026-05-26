import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

//routes
import userRoutes from './src/routes/userRoute.js'
import productRoutes from './src/routes/productRoute.js'
import userProfileRoutes from "./src/routes/userProfileRoute.js";
import cartRoutes from "./src/routes/cartRoute.js";
import wishlistRoutes from "./src/routes/wishlistRoute.js";
import orderRoutes from './src/routes/orderRoute.js'

const app = express()

app.use(cors({
    origin: ["https://neoecommerce.vercel.app","http://localhost:5173"],
    credentials: true,       // 👈 allow cookies
}))


app.use(express.json())
app.use(cookieParser())

//routes
app.use('/api',userRoutes) // test
app.use("/api/products", productRoutes); // get all product

//testing 
app.use("/api/user", userProfileRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user/order",orderRoutes)
// app.get("api/all/products", getProducts);
app.get("/",(req,res)=>{
    res.send("Hello world")
})

// app.use('/api/admin',adminRoute)

export default app