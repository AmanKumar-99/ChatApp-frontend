import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import {
  sendMessage,
  Attachment,
} from "@/store/slices/chatSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Send, Paperclip, Image, Mic, Video, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSocket } from "@/context/socketContext"
import { useChatSocket } from "@/hooks/use-chatSocket"

export const MessageInput = () => {
  const socket = useSocket()
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { activeChatId } = useSelector((state: RootState) => state.chat)
  const { toast } = useToast()
  const buttonRef = useRef(null)

  const handleSend = () => {
    if ((!message.trim() && attachments.length === 0) || !socket) return

    socket.emit("chat:message", {
      chatId: activeChatId,
      senderId: user?.id,
      content: message,
      mediaUrl: attachments[attachments.length - 1]?.url,
      fileData: attachments[attachments.length - 1]?.url,
      originalFileName: attachments[attachments.length - 1]?.name,
      fileType: attachments.length > 0 ? "file" : "text",
      fileName: attachments[attachments.length - 1]?.name,
    })

    socket.on("chat:messageSent",(messageId: string)=>{
      dispatch(
        sendMessage({
          id: messageId,
          chatId: activeChatId,
          content: message,
          senderId: user?.id || "1",
          senderName: user?.name || "You",
          attachments: attachments.length > 0 ? attachments : undefined,
          type: attachments.length > 0 ? "file" : "text",
        })
      )
    })

    setMessage("")
    setAttachments([])
  }

  useChatSocket(activeChatId, user?.id, (_) => {
    const button = buttonRef.current

    if (button) {
      button.addEventListener("click", handleSend)
    }

    return () => {
      if (button) {
        button.removeEventListener("click", handleSend)
      }
    }
  })

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (type: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = getAcceptType(type)
      fileInputRef.current.click()
    }
  }

  const getAcceptType = (type: string) => {
    switch (type) {
      case "image":
        return "image/*"
      case "video":
        return "video/*"
      case "audio":
        return "audio/*"
      default:
        return "*/*"
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }))

    setAttachments((prev) => [...prev, ...newAttachments])
    toast({
      title: "Files attached",
      description: `${newAttachments.length} file(s) ready to send`,
    })
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  return (
    <div className='border-t bg-card p-4'>
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className='mb-3 space-y-2'>
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className='flex items-center gap-2 p-2 bg-muted rounded-lg'
            >
              <FileText className='w-4 h-4' />
              <span className='text-sm flex-1 truncate'>
                {attachment.name}
              </span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => removeAttachment(attachment.id)}
                className='h-6 w-6 p-0'
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className='flex items-end gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='shrink-0'>
              <Paperclip className='w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='top' align='start'>
            <DropdownMenuItem onClick={() => handleFileSelect("image")}>
              <Image className='w-4 h-4 mr-2' />
              Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileSelect("video")}>
              <Video className='w-4 h-4 mr-2' />
              Video
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileSelect("audio")}>
              <Mic className='w-4 h-4 mr-2' />
              Audio
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileSelect("document")}>
              <FileText className='w-4 h-4 mr-2' />
              Document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          placeholder='Type a message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className='flex-1'
        />

        <Button
          ref={buttonRef}
          onClick={handleSend}
          size='sm'
          disabled={!message.trim() && attachments.length === 0}
        >
          <Send className='w-4 h-4' />
        </Button>

        <input
          ref={fileInputRef}
          type='file'
          multiple
          onChange={handleFileChange}
          className='hidden'
        />
      </div>
    </div>
  )
}
