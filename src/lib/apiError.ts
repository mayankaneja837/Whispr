import { ApiError } from "../types/ApiError";

export function apiError(statusCode:number,message:string){
    const payload:ApiError = {
        statusCode,
        success:false,
        message
    }

    return Response.json(payload,{
        status:statusCode
    })
}