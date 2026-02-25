"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback } from "usehooks-ts"
import { signupSchema } from "../../../schemas/signupSchema"
import { AxiosError } from "axios"
import { ApiResponse } from "../../../types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Spinner } from "../../../components/ui/spinner"
import { logger } from "../../../lib/logger"
import apiClient from "../../../lib/axios"
import Link from "next/link"

export default function SignUpComponent() {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 700)
  const router = useRouter()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage("")
        try {
          const response = await apiClient.get(
            `/check_username_unique?username=${username}`
          )
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ??
              "Error checking the username"
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }

    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
      await apiClient.post(`/signup`, data)
      router.replace(`/verify/${username}`)
    } catch (error) {
      logger.error("Error in submitting user form", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] px-6 text-white pt-24">

      <div className="absolute w-[500px] h-[500px] bg-teal-500 blur-3xl opacity-10 rounded-full"></div>

      <div className="relative w-full max-w-md p-10 bg-white/5 border border-white/10 rounded-3xl">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400">
            Create Your Whispr
          </h1>
          <p className="mt-3 text-gray-400">
            Start receiving anonymous messages.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                      className="bg-white/5 border border-white/10 focus:border-teal-400 text-white rounded-xl"
                    />
                  </FormControl>

                  {isCheckingUsername && (
                    <Spinner className="mt-2 h-4 w-4 animate-spin text-teal-400" />
                  )}

                  {usernameMessage && (
                    <p
                      className={`text-sm mt-1 ${
                        usernameMessage === "Username available"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}

                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
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
              disabled={isSubmitting}
              className="w-full py-3 bg-teal-400 text-black rounded-xl hover:bg-teal-300 transition cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </div>
              ) : (
                "Get Started"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-teal-400 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}