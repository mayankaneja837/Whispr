"use client"

import { signInSchema } from "../../../schemas/signinSchema"
import * as React from "react"
import * as z from "zod"
import { Form } from "../../../components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import {
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "../../../components/ui/form"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { logger } from "../../../lib/logger"
import { toast } from "sonner"
import Link from "next/link"

const SigninComponent = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/dashboard",
      identifier: data.identifier,
      password: data.password,
    })

    if (result?.error) {
      logger.log("Error while signing in")
      toast.error(result?.error || "Login Failed", {
        id: "signin-error",
        duration: 2500,
      })
      return
    }

    if (result?.ok) {
      window.location.assign(result.url ?? "/dashboard")
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] px-6 text-white pt-24">

      <div className="absolute w-[500px] h-[500px] bg-teal-500 blur-3xl opacity-10 rounded-full"></div>

      <div className="relative w-full max-w-md p-10 bg-white/5 border border-white/10 rounded-3xl">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400">
            Welcome Back
          </h1>
          <p className="mt-3 text-gray-400">
            Sign in to continue to your anonymous link generation.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Email or Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email / username"
                      {...field}
                      className="bg-white/5 border border-white/10 focus:border-teal-400 text-white rounded-xl"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password"
                      {...field}
                      className="bg-white/5 border border-white/10 focus:border-teal-400 text-white rounded-xl"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full py-3 bg-teal-400 text-black rounded-xl hover:bg-teal-300 transition"
            >
              {form.formState.isSubmitting
                ? "Signing in..."
                : "Sign In"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Don’t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-teal-400 hover:underline"
          >
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}

export default SigninComponent