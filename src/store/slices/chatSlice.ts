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

export interface Chat {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: Message;
  messages: Message[];
}

interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  messages: Message[];
  isLoading: boolean;
}

const initialState: ChatState = {
  chats: [
    {
      id: '1',
      name: 'General',
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
  },
});

export const { setActiveChat, addMessage, sendMessage } = chatSlice.actions;
export default chatSlice.reducer;