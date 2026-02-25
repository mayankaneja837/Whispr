"use client"
import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { MessageSchema } from "../../../schemas/MessageSchema"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "../../../components/ui/textarea"
import { useParams } from "next/navigation"
import { useCompletion } from "@ai-sdk/react"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../../components/ui/form"
import { Button } from "../../../components/ui/button"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Separator } from "../../../components/ui/separator"
import Link from "next/link"
import { logger } from "../../../lib/logger"
import apiClient from "../../../lib/axios"

const specialChar = "||"

const parsedMessages = (messageString: string): string[] => {
  return messageString.split(specialChar)
}

const initialMessaging =
  "What's your favorite hobby? || Do you have a pet? || What's your favorite movie"

const SendMessageComponent = () => {
  const [isLoading, setIsLoading] = useState(false)

  const params = useParams()
  const username = params.username

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessaging,
  })

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  })

  const messageContent = form.watch("content")

  const handleMessageContent = (message: string) => {
    form.setValue("content", message)
  }

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true)
    try {
      const response = await apiClient.post("/send-message", {
        username: username,
        ...data,
      })

      toast.success("Message received", {
        description: response.data.message,
      })

      form.reset({ ...form.getValues(), content: "" })
    } catch (error) {
      logger.error("Error while sending message", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestedMessages = async () => {
    try {
      complete("")
    } catch (error) {
      logger.error("Error while fetching suggested messages", error)
    }
  }

  useEffect(() => {}, [completion, isSuggestLoading])

  return (
    <div className="relative min-h-screen bg-[#0f172a] text-white pt-8 px-6">

      <div className="absolute w-[500px] h-[500px] bg-teal-500 blur-3xl opacity-10 rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto w-full">

        <h1 className="text-3xl font-bold text-teal-400 text-center mb-8">
          Send Anonymous Message
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      Send message to @{username}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message..."
                        className="resize-none bg-white/5 border border-white/10 focus:border-teal-400 text-white rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                {isLoading ? (
                  <Button disabled className="bg-teal-400 text-black">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent}
                    className="bg-teal-400 text-black hover:bg-teal-300"
                  >
                    Send It
                  </Button>
                )}
              </div>

            </form>
          </Form>
        </div>

        <div className="mt-8 space-y-6">

          <div className="flex flex-col items-center space-y-3">
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              className="bg-white/5 border border-white/10 hover:bg-white/10"
            >
              {isSuggestLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Suggest Messages"
              )}
            </Button>

            <p className="text-gray-400 text-sm">
              Click any suggestion below to auto-fill.
            </p>
          </div>

          <Card className="bg-white/5 border border-white/10 rounded-2xl">
            <CardHeader>
              <h3 className="text-lg font-semibold text-teal-400">
                Suggested Messages
              </h3>
            </CardHeader>

            <CardContent className="flex flex-col space-y-4">
              {error ? (
                <p className="text-red-400">{error.message}</p>
              ) : (
                parsedMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="border-white/10 text-black hover:bg-white/10"
                    onClick={() => handleMessageContent(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="text-center text-gray-400 space-y-4 pb-10">
          <p>Want your own anonymous board?</p>
          <Link href="/sign-up">
            <Button className="bg-teal-400 text-black hover:bg-teal-300">
              Create Account
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default SendMessageComponent