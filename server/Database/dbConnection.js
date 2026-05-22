import mongoose from "mongoose";

export const connection = () => {
    mongoose
        .connect(process.env.MONGODB_URI, {
            dbName: "MERN_AUTHORIZATION"
        })
        .then(() => {
            console.log("Database is connected")
        })
        .catch((error) => {
            console.log(`Some error occurred while connecting to database ${error}`)
        })
}