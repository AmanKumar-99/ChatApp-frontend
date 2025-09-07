import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { setActiveChat } from '@/store/slices/chatSlice';
import { NewChatDialog } from './NewChatDialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, LogOut, Hash, User } from 'lucide-react';

export const ChatSidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { chats, activeChat } = useSelector((state: RootState) => state.chat);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-64 bg-chat-sidebar border-r flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="font-bold text-lg">ChatApp</h1>
        </div>
        
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="w-8 h-8 p-0"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat Lists */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Channels */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground">CHANNELS</h2>
            </div>
            
            <div className="space-y-1">
              {chats.filter(chat => chat.type === 'channel').map((chat) => (
                <Button
                  key={chat.id}
                  variant={activeChat === chat.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => dispatch(setActiveChat(chat.id))}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chat.name}</p>
                      {chat.lastMessage && (
                        <p className="text-xs text-muted-foreground truncate">
                          {chat.lastMessage.text}
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
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground">DIRECT MESSAGES</h2>
              <NewChatDialog />
            </div>
            
            <div className="space-y-1">
              {chats.filter(chat => chat.type === 'direct').map((chat) => {
                const otherUser = chat.participantDetails?.[0];
                return (
                  <Button
                    key={chat.id}
                    variant={activeChat === chat.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => dispatch(setActiveChat(chat.id))}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="relative">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={otherUser?.avatar} />
                          <AvatarFallback className="text-xs">
                            {otherUser?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        {otherUser?.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-background rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{chat.name}</p>
                          {otherUser?.isOnline && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                        </div>
                        {chat.lastMessage && (
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.lastMessage.text}
                          </p>
                        )}
                      </div>
                    </div>
                  </Button>
                );
              })}
              
              {chats.filter(chat => chat.type === 'direct').length === 0 && (
                <p className="text-xs text-muted-foreground px-3 py-2">
                  No direct messages yet. Click + to start a conversation.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};