import mongoose from "mongoose";
import {logger} from "./logger"
type ConnectionObject = {
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        logger.log("Already connected to the database")
        return
    }

    try{
       const db =  await mongoose.connect(process.env.MONGO_URI || '')
       connection.isConnected = db.connections[0].readyState

    }catch(error){

        logger.error("Error while connecting to the database",error)
        throw new Error("Database connection failed")
    }
}

export default dbConnect;