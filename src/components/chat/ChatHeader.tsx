import { Chat } from '@/store/slices/chatSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Video, MoreVertical, Hash } from 'lucide-react';

interface ChatHeaderProps {
  chat: Chat;
}

export const ChatHeader = ({ chat }: ChatHeaderProps) => {
  return (
    <div className="border-b bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {chat.type === 'channel' ? (
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <Hash className="w-4 h-4 text-muted-foreground" />
            </div>
          ) : (
            <div className="relative">
              <Avatar className="w-8 h-8">
                <AvatarImage src={chat.participantDetails?.[0]?.avatar} />
                <AvatarFallback>
                  {chat.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {chat.participantDetails?.[0]?.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
              )}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">{chat.name}</h2>
              {chat.type === 'direct' && chat.participantDetails?.[0]?.isOnline && (
                <Badge variant="secondary" className="text-xs">Online</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {chat.type === 'channel' 
                ? `${chat.participants.length} members` 
                : chat.participantDetails?.[0]?.email
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};