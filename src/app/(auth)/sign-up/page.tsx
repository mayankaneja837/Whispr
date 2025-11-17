"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import {useDebounceCallback} from 'usehooks-ts'
import { signupSchema } from "../../../schemas/signupSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "../../../types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Spinner } from "../../../components/ui/spinner"

export default function SignUpComponent(){
  const [username,setUsername] = useState("")
  const [usernameMessage,setUsernameMessage] = useState("")
  const [isCheckingUsername,setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)
  
  const debounced = useDebounceCallback(setUsername,700)

  const router = useRouter()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues:{
      username: '',
      email:'',
      password:''
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async ()=>{
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage("")
        try {
          const response = await axios.get(`/api/check_username_unique?username=${username}`)
          setUsernameMessage(response.data.message)

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking the username"
          )
        } finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit = async (data:z.infer<typeof signupSchema>)=>{
    setIsSubmitting(true)
    try {
      await axios.post(`/api/signup`,data)

      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in submitting user form",error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField 
               control={form.control}
               name="username"
               render={({ field })=>(
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field}
                    onChange={(e)=>{
                      field.onChange(e)
                      debounced(e.target.value)
                    }}
                     />
                  </FormControl>
                  {isCheckingUsername && <Spinner className="animate-spin"/>}
                  <p className={`text-sm ${usernameMessage === "Username available" ? 'text-green-500':'text-red-500'}` }>
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
               )}
               />

                <FormField 
               control={form.control}
               name="email"
               render={({ field })=>(
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
               )}
               />

                <FormField 
               control={form.control}
               name="password"
               render={({ field })=>(
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type = "password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
               )}
               />
              <Button type="submit" disabled={isSubmitting}>
                {
                  isSubmitting ? (
                    <div>
                      <Spinner className="mr-2 h-4 w-4 animate-spin" /> Please wait 
                    </div>
                  ) : ('Signup')
                }
              </Button>
            </form>
          </Form>
          
        </div>
      </div>
    </div>
  )
}