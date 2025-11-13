import {Message} from "../models/User"

export interface ApiResponse{
    success: Boolean,
    message: string,
    statuscode?: number,
    isAcceptingMessage?:Boolean,
    messages?:[Message]
}