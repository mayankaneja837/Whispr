"use client"
import React, { useState,useEffect } from "react";
import { toast } from "sonner"
import { useForm } from 'react-hook-form'
import { MessageSchema } from "../../../schemas/MessageSchema"
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Textarea } from "../../../components/ui/textarea"
import { useParams } from "next/navigation";
import { useCompletion } from "@ai-sdk/react"
import { Form, FormField, FormItem,FormLabel,FormControl,FormMessage } from "../../../components/ui/form"
import { Button } from "../../../components/ui/button"
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Separator } from "../../../components/ui/separator"
import Link from "next/link";

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
        api: '/api/suggest-messages',
        initialCompletion: initialMessaging
    })


    const form = useForm<z.infer<typeof MessageSchema>>({
        resolver: zodResolver(MessageSchema)
    })

    const messageContent = form.watch("content")

    const handleMessageContent = (message: string) => {
        form.setValue("content", message)
    }

    const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/send-message', {
                username: username,
                ...data
            })

            toast.success("Message received", {
                description: response.data.message
            })

            form.reset({ ...form.getValues(), content: '' })

        } catch (error) {
            console.error("Error in sending the message",error)
            toast.error("Error", {
                description: "Failed to sent the message"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSuggestedMessages = async () => {
        try {
            complete('')
        } catch (error) {
            console.error("Error while fetching suggest-messages",error)
            toast.error("Error", {
                description: "Error while fetching"
            })
        }
    }

    //debugging
    useEffect(() => {
    console.log('Completion changed:', completion);
    console.log('Parsed messages:', parsedMessages(completion));
    console.log('Is loading:', isSuggestLoading);
}, [completion, isSuggestLoading])

    return <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link </h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Write your anonymous message here"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-center">
                    {
                        isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait 
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading || !messageContent}>
                                Send It
                            </Button>
                        )
                    }
                </div>
            </form>
        </Form>

        <div className="my-8 space-y-4">
            <div className="space-y-2">
                <Button onClick={fetchSuggestedMessages} className="my-4" disabled={isSuggestLoading}>
                    Suggest Messages
                </Button>
                <p>Click on any of the below message to send</p>
            </div>
            
        <Card>
            <CardHeader>
                <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                {error?(
                    <p className="text-red-500">{error.message}</p>
                ):(
                    parsedMessages(completion).map((message,index)=>
                        <Button
                        key={index}
                        variant="outline"
                        onClick={()=>{
                            handleMessageContent(message)
                        }}
                     >
                        {message}
                     </Button>
                    )
                )}
            </CardContent>
        </Card>
        </div>
        <Separator className="my-6"/>

            <div className=" flex flex-col text-center mb-4">
                Get your message board
                <Link href='/api/sign-in'>
                <Button className="mt-2">Create Account</Button>
                </Link>
            </div>
        </div>

}

export default SendMessageComponent