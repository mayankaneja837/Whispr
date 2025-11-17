import {Message} from "../models/User"

export interface ApiResponse{
    success: boolean,
    message: string,
    statuscode?: number,
    isAcceptingMessage?:boolean,
    messages?:[Message]
}