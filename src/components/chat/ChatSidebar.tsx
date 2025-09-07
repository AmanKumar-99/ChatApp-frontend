import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { setActiveChat } from '@/store/slices/chatSlice';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, LogOut, Plus } from 'lucide-react';

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

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground">CHANNELS</h2>
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-1">
            {chats.map((chat) => (
              <Button
                key={chat.id}
                variant={activeChat === chat.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => dispatch(setActiveChat(chat.id))}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-2 h-2 bg-primary rounded-full" />
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
      </div>
    </div>
  );
};