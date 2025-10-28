"use client"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/models/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import MessageCard from "../../../components/MessageCard"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { RefreshCcw } from "lucide-react"

const page = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    // use the toast function directly from 'sonner' when needed
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessages: false
        }
    })

    const { watch, register, setValue } = form

    const acceptMessages = watch("acceptMessages")

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)

        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue("acceptMessages", Boolean(response.data.isAcceptingMessage))
        } catch (error) {
            const axiosError = error as AxiosError
            console.error(axiosError)
            const responseData = axiosError.response?.data as { message?: string } | undefined
            toast("Error", {
                description: responseData?.message || "Failed to fetch user Messages",
            })
        }
        finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast.success ("Refreshed Messages", {
                    description: "Showing latest messages"
                })
            }

        } catch (error) {
            const axiosError = error as AxiosError
            const responseData = axiosError.response?.data as { message?: string } | undefined
            toast.error("Error", {
                description: responseData?.message || "Failed to fetch user Messages",
            })
        }
        finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) {
            return
        }
        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, fetchMessages, fetchAcceptMessage])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>("/api/accept-messages", {
                acceptMessages: !acceptMessages
            })
            setValue("acceptMessages", !acceptMessages)
            toast.success("Switch Changed",{
                description:"User is now accepting messages"
            })
        } catch (error) {
            const axiosError = error as AxiosError
            console.error(axiosError)
            const responseData = axiosError.response?.data as { message?: string } | undefined
            toast("Error", {
                description: responseData?.message || "Failed to fetch user Messages",
            })
        }
    }

    const username = session?.user.username
    // Todo : do more research
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success("URL copied", {
            description: "Profile URL has been copied to clipboard"
        })
    }

    if (!session || !session.user) {
        return <div>

        </div>
    }


    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">
                User Dashboard
            </h1>
            <div className="mb-4">
                <h2>Copy your Unique link</h2>{''}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        className="input input-bordered w-full pr-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div>
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages : {acceptMessages? 'On':'Off'}
                </span>
            </div>
            <Separator /> 

            <Button 
            variant={"outline"}
            className="mt-4"
            onClick={(e)=>{
                e.preventDefault()
                fetchMessages(true)
            }}>
                {isLoading?<Loader2 className="h-4 w-4 animate-spin"
                 />:<RefreshCcw className="h-4 w-4"/>}
            </Button>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ?
                messages.map((message,index)=>(
                    <MessageCard
                    //@ts-ignore
                    key={message._id}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                     />
                )):(
                    <p>No Message to display.</p>
                )
                }
            </div>
        </div>
    )
}

export default page