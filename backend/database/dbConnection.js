import mongoose   from "mongoose";

export const dbConnection = ()=>{
    mongoose
    .connect(process.env.MONGO_URI, {
        dbName: "RESTAURANT",

    })
    .then(() => {
        console.log("Connected to databse succesfully!");
    
    })
    .catch((err) => {
        console.log(`Some error happend! ${err}`);
    });
    
};
