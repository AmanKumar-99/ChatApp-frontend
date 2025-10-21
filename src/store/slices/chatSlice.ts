import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Message {
  id: string
  chatId: string
  content: string
  senderId: string
  senderName: string
  createdAt: Date | string
  attachments?: Attachment[]
  type: "text" | "image" | "file" | "audio" | "video"
}

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface User {
  id: string
  name: string
  email: string
  profilePicUrl?: string // avatar URL
  isOnline?: boolean
}

export interface Chat {
  id: string
  name: string
  type: "group" | "direct"
  members: string[]
  memberDetails?: User[]
  lastMessage?: Message
  messages: Message[]
  createdAt: Date
}

interface ChatState {
  chats: Chat[] // Overall chats
  activeChatId: string | null
  messages: Message[] // Overall messages
  users: User[] // Overall users
  isLoading: boolean
}

const initialState: ChatState = {
  chats: [],
  users: [],
  activeChatId: "1",
  messages: [],
  isLoading: false,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChatId = action.payload
      const chat = state.chats.find((c) => c.id === action.payload)
      state.messages = chat?.messages || []
    },
    setMessage: (
      state,
      action: PayloadAction<{ messages: Message[] }>
    ) => {
      const chat = state.chats.find((c) => c.id === state.activeChatId)
      if (chat) {
        chat.messages = action.payload.messages
        chat.lastMessage =
          action.payload.messages[action.payload.messages.length - 1]
        state.messages = action.payload.messages
      }
    },
    sendMessage: (
      state,
      action: PayloadAction<Omit<Message, "id" | "createdAt">>
    ) => {
      const newMessage: Message = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }

      const chat = state.chats.find((c) => c.id === state.activeChatId)
      if (chat) {
        chat.messages.push(newMessage)
        chat.lastMessage = newMessage
        state.messages.push(newMessage)
      }
    },
    setListOfUsers: (state, action: PayloadAction<{ users: User[] }>) => {
      const { users } = action.payload
      state.users = [...users]
    },
    createDirectMessage: (
      state,
      action: PayloadAction<{
        chatId: string
        createdAt?: Date
        currentUserId: string
        isUserOnline: boolean
        userId: string
        userEmail: string
        userName: string
        userAvatar?: string
      }>
    ) => {
      const {
        chatId,
        currentUserId,
        isUserOnline,
        userId,
        userName,
        userAvatar,
        userEmail,
        createdAt, // Not sure we need this
      } = action.payload

      // Check if DM already exists
      const existingDM = state.chats.find(
        (chat) =>
          chat.type === "direct" &&
          chat.members.includes(userId) &&
          chat.members.includes(currentUserId)
      )

      if (existingDM) {
        state.activeChatId = existingDM.id
        state.messages = existingDM.messages
        return
      }

      // Create new DM
      const newDM: Chat = {
        id: chatId,
        name: userName,
        type: "direct",
        members: [currentUserId, userId],
        memberDetails: [
          {
            id: userId,
            name: userName,
            email: `${userEmail.toLowerCase()}`,
            profilePicUrl: userAvatar,
            isOnline: isUserOnline,
          },
        ],
        messages: [],
        createdAt,
      }

      state.chats.push(newDM)
      state.activeChatId = newDM.id
      state.messages = []
    },
    createGroup: (
      state,
      action: PayloadAction<{
        name: string
        memberIds: string[]
      }>
    ) => {
      const { name, memberIds } = action.payload
      const newGroup: Chat = {
        id: `group-${Date.now()}`,
        name,
        type: "group",
        members: memberIds,
        memberDetails: state.users.filter((u) => memberIds.includes(u.id)),
        messages: [],
        createdAt: new Date(),
      }
      state.chats.push(newGroup)
    },
  },
})

export const {
  setActiveChat,
  setMessage,
  setListOfUsers,
  sendMessage,
  createGroup,
  createDirectMessage,
} = chatSlice.actions
export default chatSlice.reducer
