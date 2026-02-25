"use client"
import { useCallback, useEffect, useState } from "react"
import { Separator } from "../../../components/./ui/separator"
import { Switch } from "../../../components/ui/switch"
import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "../../../components/MessageCard"
import { Message } from "../../../models/User"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { acceptMessageSchema } from "../../../schemas/acceptMessageSchema"
import { AxiosError } from "axios"
import { Button } from "../../../components/ui/button"
import { ApiResponse } from "../../../types/ApiResponse"
import { toast } from "sonner"
import {logger} from "../../../lib/logger"
import apiClient from "../../../lib/axios"

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
            String(message._id) !== messageId
        ))
    }

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await apiClient.get<ApiResponse>('/accept-messages')
            setValue("acceptMessages", Boolean(response.data.isAcceptingMessage))
        } catch (error) {
            logger.error("Error in fetching the accept State of the user",error)
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])


    const fetchMessages = useCallback(async () => {
        setIsLoading(true)
        setIsSwitchLoading(false)

        try {
            const response = await apiClient.get<ApiResponse>('/get-messages')
            setMessages(response.data.messages || [])
            toast.success("Messages Fetched", {
                description: "Latest messages fetched"
            })
        } catch (error) {
            const axiosError = error as AxiosError
            logger.log(axiosError)
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setMessages, setIsLoading])

    const handleSwitchChange = async () => {
        try {
            const newValue = !acceptMessages
            await apiClient.post<ApiResponse>('/accept-messages', {
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
            logger.error("Error from handleSwitchChange", axiosError)
        }
    }

    useEffect(() => {
        if (!session || !session.user) {
            return
        }

        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

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
            logger.error("Error in copying the profile URL", error)
        }
    }, [profileUrl]);


    if (!session || !session.user) {
        return <div>
            Please login
        </div>
    }

    return (
  <div className="relative min-h-screen bg-[#0f172a] text-white pt-28 px-6">

    <div className="absolute w-[500px] h-[500px] bg-teal-500 blur-3xl opacity-10 rounded-full"></div>

    <div className="relative max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold text-teal-400 mb-8">
        Dashboard
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Your Public Link
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={profileUrl}
            disabled
            readOnly
            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300"
          />
          <Button
            onClick={copyToClipboard}
            className="bg-teal-400 text-black hover:bg-teal-300"
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 flex items-center justify-between">
        <span>
          Accept Messages:
          <span className="ml-2 text-teal-400">
            {acceptMessages ? "On" : "Off"}
          </span>
        </span>

        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
      </div>

      <Separator className="bg-white/10" />

      <Button
        className="mt-6 bg-white/5 border border-white/10 hover:bg-white/10"
        onClick={(e) => {
          e.preventDefault()
          fetchMessages()
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-gray-400">
            No messages yet.
          </p>
        )}
      </div>
    </div>
  </div>
)
}



export default UserDashboard