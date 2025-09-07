import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  attachments?: Attachment[];
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  type: 'channel' | 'direct';
  participants: string[];
  participantDetails?: User[];
  lastMessage?: Message;
  messages: Message[];
  createdAt: Date;
}

interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  messages: Message[];
  users: User[];
  isLoading: boolean;
}

const initialState: ChatState = {
  chats: [
    {
      id: '1',
      name: 'General',
      type: 'channel',
      participants: ['user1', 'user2'],
      messages: [
        {
          id: '1',
          text: 'Welcome to the chat!',
          senderId: 'user2',
          senderName: 'System',
          timestamp: new Date(),
          type: 'text',
        },
      ],
      createdAt: new Date(),
    },
  ],
  users: [
    {
      id: 'user2',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      isOnline: true,
    },
    {
      id: 'user3',
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      isOnline: false,
    },
    {
      id: 'user4',
      name: 'Carol Davis',
      email: 'carol@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
      isOnline: true,
    },
  ],
  activeChat: '1',
  messages: [],
  isLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChat = action.payload;
      const chat = state.chats.find(c => c.id === action.payload);
      state.messages = chat?.messages || [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const chat = state.chats.find(c => c.id === state.activeChat);
      if (chat) {
        chat.messages.push(action.payload);
        chat.lastMessage = action.payload;
        state.messages.push(action.payload);
      }
    },
    sendMessage: (state, action: PayloadAction<Omit<Message, 'id' | 'timestamp'>>) => {
      const newMessage: Message = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      
      const chat = state.chats.find(c => c.id === state.activeChat);
      if (chat) {
        chat.messages.push(newMessage);
        chat.lastMessage = newMessage;
        state.messages.push(newMessage);
      }
    },
    createDirectMessage: (state, action: PayloadAction<{ userId: string; userName: string; userAvatar?: string }>) => {
      const { userId, userName, userAvatar } = action.payload;
      const currentUserId = '1'; // This would come from auth state in real app
      
      // Check if DM already exists
      const existingDM = state.chats.find(
        chat => chat.type === 'direct' && 
        chat.participants.includes(userId) && 
        chat.participants.includes(currentUserId)
      );
      
      if (existingDM) {
        state.activeChat = existingDM.id;
        state.messages = existingDM.messages;
        return;
      }
      
      // Create new DM
      const newDM: Chat = {
        id: `dm-${Date.now()}`,
        name: userName,
        type: 'direct',
        participants: [currentUserId, userId],
        participantDetails: [
          {
            id: userId,
            name: userName,
            email: `${userName.toLowerCase().replace(' ', '.')}@example.com`,
            avatar: userAvatar,
            isOnline: Math.random() > 0.5,
          }
        ],
        messages: [],
        createdAt: new Date(),
      };
      
      state.chats.push(newDM);
      state.activeChat = newDM.id;
      state.messages = [];
    },
  },
});

export const { setActiveChat, addMessage, sendMessage, createDirectMessage } = chatSlice.actions;
export default chatSlice.reducer;