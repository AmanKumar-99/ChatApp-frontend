import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store/store"
import { logout } from "@/store/slices/authSlice"
import { setActiveChat } from "@/store/slices/chatSlice"
import { NewChatDialog } from "./NewChatDialog"
import { NewGroupDialog } from "./NewGroupDialog"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, LogOut, Hash } from "lucide-react"
import { useCallback } from "react"
import api from "@/api"
import { useNavigate } from "react-router-dom"
import { useSocket } from "@/context/socketContext"

export const ChatSidebar = () => {
  const socket = useSocket()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { chats, activeChatId } = useSelector(
    (state: RootState) => state.chat
  )

  const avatarSrc = user ? user.profilePicUrl ?? undefined : undefined

  const handleLogout = useCallback(async () => {
    const res = await api.post("/auth/logout")

    if (res.data.ok) {
      // On successful logout
      dispatch(logout())
      socket.emit("disconnected")
      socket.disconnect()
      sessionStorage.clear()
      navigate("/login")
    }
  }, [dispatch, navigate, socket])

  return (
    <div className='w-64 bg-chat-sidebar border-r flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center'>
            <MessageCircle className='w-4 h-4 text-primary-foreground' />
          </div>
          <h1 className='font-bold text-lg'>ChatApp</h1>
        </div>

        {/* User Info */}
        <div className='flex items-center gap-3'>
          <Avatar className='w-8 h-8'>
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium truncate'>{user?.name}</p>
            <p className='text-xs text-muted-foreground truncate'>
              {user?.email}
            </p>
          </div>
          <div className='flex items-center gap-1'>
            <ThemeToggle />
            <Button
              variant='ghost'
              size='sm'
              onClick={handleLogout}
              className='w-8 h-8 p-0'
            >
              <LogOut className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Lists */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 space-y-6'>
          {/* Groups */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <h2 className='text-sm font-semibold text-muted-foreground'>
                GROUP MESSAGES
              </h2>
              <NewGroupDialog />
            </div>

            <div className='space-y-1'>
              {chats
                .filter((chat) => chat.type === "group")
                .map((chat) => (
                  <Button
                    key={chat.id}
                    variant={
                      activeChatId === chat.id ? "secondary" : "ghost"
                    }
                    className='w-full justify-start text-left h-auto p-3'
                    onClick={() => dispatch(setActiveChat(chat.id))}
                  >
                    <div className='flex items-center gap-3 w-full'>
                      <Hash className='w-4 h-4 text-muted-foreground' />
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium truncate'>
                          {chat.name}
                        </p>
                        {chat.lastMessage && (
                          <p className='text-xs text-muted-foreground truncate'>
                            {chat.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <h2 className='text-sm font-semibold text-muted-foreground'>
                DIRECT MESSAGES
              </h2>
              <NewChatDialog />
            </div>

            <div className='space-y-1'>
              {chats
                .filter((chat) => chat.type === "direct")
                .map((chat) => {
                  const otherUser = chat.memberDetails?.[0]
                  return (
                    <Button
                      key={chat.id}
                      variant={
                        activeChatId === chat.id ? "secondary" : "ghost"
                      }
                      className='w-full justify-start text-left h-auto p-3'
                      onClick={() => dispatch(setActiveChat(chat.id))}
                    >
                      <div className='flex items-center gap-3 w-full'>
                        <div className='relative'>
                          <Avatar className='w-6 h-6'>
                            <AvatarImage src={otherUser?.profilePicUrl} />
                            <AvatarFallback className='text-xs'>
                              {otherUser?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          {otherUser?.isOnline && (
                            <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-background rounded-full' />
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2'>
                            <p className='text-sm font-medium truncate'>
                              {chat.name}
                            </p>
                            {otherUser?.isOnline && (
                              <div className='w-2 h-2 bg-green-500 rounded-full' />
                            )}
                          </div>
                          {chat.lastMessage && (
                            <p className='text-xs text-muted-foreground truncate'>
                              {chat.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </Button>
                  )
                })}

              {chats.filter((chat) => chat.type === "direct").length ===
                0 && (
                <p className='text-xs text-muted-foreground px-3 py-2'>
                  No direct messages yet. Click + to start a conversation.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
