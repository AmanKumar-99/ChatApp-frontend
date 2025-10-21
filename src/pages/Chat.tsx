import { ChatSidebar } from "@/components/chat/ChatSidebar"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { useSocket } from "@/context/socketContext"
import type { RootState } from "@/store/store"
import { useEffect } from "react"
import { useSelector } from "react-redux"

const Chat = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const socket = useSocket()

  useEffect(() => {
    if (user) {
      socket.emit("user:join", user?.id)
    }
  }, [socket, user])

  return (
    <div className='h-screen flex bg-chat-background'>
      <ChatSidebar />
      <ChatWindow />
    </div>
  )
}

export default Chat
