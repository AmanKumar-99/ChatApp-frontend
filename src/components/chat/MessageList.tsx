import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { MessageBubble } from "./MessageBubble"
import { useChatSocket } from "@/hooks/use-chatSocket"
import { setMessage, type Message } from "@/store/slices/chatSlice"

export const MessageList = () => {
  const { activeChatId, messages } = useSelector(
    (state: RootState) => state.chat
  )

  const { user } = useSelector((state: RootState) => state.auth)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  useChatSocket(activeChatId, user?.id, (message: Message) => {
    if (message?.senderId !== user?.id) {
      dispatch(
        setMessage({
          messages: [...messages, message],
        })
      )
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message}
          isOwnMessage={message.senderId === user?.id}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
