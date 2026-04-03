import app from './app.js'
import connectDb from './src/config/db.js'
import env from 'dotenv'

env.config()


connectDb()
    .then(
        app.listen(process.env.PORT, () => {
            console.log("server is started on Port", process.env.PORT)
        })
    ).catch((err) => {
        if (err instanceof Error) {
            console.log(err)
        }else{
            console.log("An unknown error occurred", err);
        }
    })