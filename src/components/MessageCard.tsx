"use client"
import {
  Card,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "../models/User"
import axios from "axios"
import { ApiResponse } from "../types/ApiResponse"
import dayjs from "dayjs"

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    onMessageDelete(String(message._id))
  }

  return (
    <Card className="bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition">

      <CardHeader className="space-y-4">

        <div className="flex justify-between items-start gap-4">

          <CardTitle className="text-gray-100 text-base font-medium leading-relaxed">
            {message.content}
          </CardTitle>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-[#0f172a] border border-white/10 text-white">

              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Delete this message?
                </AlertDialogTitle>

                <AlertDialogDescription className="text-gray-400">
                  This action cannot be undone. The message will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/5 border border-white/10 text-white hover:bg-white/10">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>

            </AlertDialogContent>
          </AlertDialog>

        </div>

        <div className="text-xs text-gray-400">
          {dayjs(message.createdAt).format("MMM D, YYYY · h:mm A")}
        </div>

      </CardHeader>
    </Card>
  )
}

export default MessageCard