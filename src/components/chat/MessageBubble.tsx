import { Message } from '@/store/slices/chatSlice';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { FileIcon, ImageIcon, MicIcon, VideoIcon } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageBubble = ({ message, isOwnMessage }: MessageBubbleProps) => {
  const getAttachmentIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (type.startsWith('video/')) return <VideoIcon className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <MicIcon className="w-4 h-4" />;
    return <FileIcon className="w-4 h-4" />;
  };

  return (
    <div className={cn(
      "flex gap-3 max-w-[70%]",
      isOwnMessage ? "ml-auto flex-row-reverse" : ""
    )}>
      {!isOwnMessage && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-muted text-xs">
            {message.senderName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col gap-1",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        {!isOwnMessage && (
          <span className="text-xs text-muted-foreground font-medium">
            {message.senderName}
          </span>
        )}
        
        <div className={cn(
          "rounded-2xl px-4 py-2 shadow-message transition-all hover:shadow-lg",
          isOwnMessage 
            ? "bg-chat-sent text-primary-foreground" 
            : "bg-chat-received hover:bg-chat-hover"
        )}>
          {message.text && (
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          )}
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border",
                    isOwnMessage 
                      ? "bg-primary-foreground/10 border-primary-foreground/20" 
                      : "bg-muted border-border"
                  )}
                >
                  {getAttachmentIcon(attachment.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{attachment.name}</p>
                    <p className="text-xs opacity-70">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground">
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};