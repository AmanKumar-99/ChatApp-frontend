import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const ChatWindow = () => {
  const { activeChat, chats } = useSelector((state: RootState) => state.chat);
  const activeChatData = chats.find(c => c.id === activeChat);

  if (!activeChatData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader chat={activeChatData} />
      <MessageList />
      <MessageInput />
    </div>
  );
};