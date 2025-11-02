"use client"
import { useCallback, useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "@/components/MessageCard"
import { Message, User } from "@/models/User"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import axios, { AxiosError } from "axios"
import { Button } from "@/components/ui/button"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"

const UserDashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [profileUrl, setProfileUrl] = useState("")

    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch("acceptMessages")

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => 
            message._id !== messageId
        ))
    }

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue("acceptMessages", Boolean(response.data.isAcceptingMessage))
        } catch (error) {
            const axiosError = error as AxiosError
            toast.error("Axios Error", {
                description: "Error in fetching the acceptMessage state of the user"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue, toast])


    const fetchMessages = useCallback(async () => {
        setIsLoading(true)
        setIsSwitchLoading(false)

        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            toast.success("Messages Fetched", {
                description: "Latest messages fetched"
            })
        } catch (error) {
            const axiosError = error as AxiosError
            console.log(axiosError)
            toast.error("Error", {
                description: "Error in fetching the messages"
            })
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setMessages, setIsLoading, toast])

    const handleSwitchChange = async () => {
        try {
            const newValue = !acceptMessages
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })
            setValue("acceptMessages", !acceptMessages)
            if (newValue) {
                toast.success("Switch changed", {
                    description: "User is now accepting Messages"
                })
            } else {
                toast.success("Switch changed", {
                    description: "User is not accepting messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError
            console.log("Error from handleSwitchChange", axiosError)
            toast.error("Error", {
                description: "Error in changing the switch"
            })
        }
    }

    useEffect(() => {
        if (!session || !session.user) {
            return
        }

        fetchMessages()
        fetchAcceptMessage()
    }, [session, toast, setValue, fetchAcceptMessage, fetchMessages])

    const username = session?.user?.username

    useEffect(() => {
        const baseUrl = `${window.location.protocol}//${window.location.host}`
        const url = `${baseUrl}/u/${username}`
        setProfileUrl(url)
    }, [username])

    const copyToClipboard = useCallback(() => {
        if (!profileUrl) return toast.error("Profile URl is empty")
        try {

            navigator.clipboard.writeText(profileUrl);

            toast.success(
                'URL Copied!', {
                description: 'Profile URL has been copied to clipboard.',
            });
        } catch (error) {
            toast(
                'Copy Failed', {
                description: 'Could not copy URL to clipboard.',
            });
        }
    }, [profileUrl]);


    if (!session || !session.user) {
        return <div>
            Please login
        </div>
    }


    console.log("AcceptMessages",acceptMessages)
    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                        readOnly
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages();
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                        //@ts-ignore
                            key={message._id}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
}



export default UserDashboard