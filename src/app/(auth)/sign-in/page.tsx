"use client"
import { signInSchema } from "@/schemas/signinSchema"
import * as React from "react"
import * as z from 'zod'
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { FormField,FormControl,FormDescription,FormMessage,FormItem,FormLabel} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SigninComponent = ()=>{
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier: '',
      password: ''
    }
  })
  const onSubmit = async(data:z.infer<typeof signInSchema>) =>{
    const result = await signIn('credentials',{
      redirect:false,
      identifier : data.identifier,
      password : data.password
    })
    console.log(result?.error)
    if(result?.error){
      console.log("Error while signing in")
    }

    if(result?.url){
      router.replace('/dashboard')
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join mystery Message
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField 
               control={form.control}
               name="identifier"
               render={({ field })=>(
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
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
              <Button type="submit">
                SignIn
              </Button>
            </form>
          </Form>
          
        </div>
      </div>
    </div>
  )
}

export default SigninComponent
