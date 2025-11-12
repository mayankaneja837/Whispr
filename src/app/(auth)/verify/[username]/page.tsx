"use client"
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../../../components/ui/form"
import {useForm} from 'react-hook-form'
import { FormField,FormControl,FormItem,FormLabel,FormMessage, } from "../../../../components/ui/form"
import { Input} from "../../../../components/ui/input"
import { Button } from "../../../../components/ui/button"
import * as z from "zod"
import { verifySchema } from "../../../../schemas/verifySchema"
import { ApiResponse } from "../../../../types/ApiResponse"
import axios, { AxiosError } from "axios";

const verifyComponent = ()=>{

    const router = useRouter()
    const params = useParams()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
        defaultValues:{
            verifyCode:''
        }
    })

   const onSubmit = async(data:z.infer<typeof verifySchema>)=>{
    try {
        const response = await axios.post('/api/verifyCode',{
            username:params.username,
            code:data.verifyCode
        })
        if(response.data.success){
            console.log("Verification complete")
            router.replace('/sign-up')
        }
        else{
            console.error("Error in verifying the user")
        }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        console.log(axiosError.response?.data.message)
    }
   }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-sm">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Code Verification
                    </h1>
                    <p className="mb-4">
                        Verify your code sent on your registered email
                    </p>
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                            control={form.control}
                            name="verifyCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="verification code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            ></FormField>

                        <Button type="submit">
                            Submit
                        </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default verifyComponent