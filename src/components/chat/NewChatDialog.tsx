import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import {
  createDirectMessage,
  setListOfUsers,
  User,
} from "@/store/slices/chatSlice"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import { getAllUsers, getUserDetailsById } from "@/api/userApi"
import axios from "axios"
import { getDirectMessageByChatIds } from "@/api/chatApi"

export const NewChatDialog = () => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dispatch = useDispatch()
  const { users } = useSelector((state: RootState) => state.chat)
  const { user: currentUser } = useSelector(
    (state: RootState) => state.auth
  )

  const filteredUsers = users.filter((user) => {
    return (
      user.id !== currentUser?.id &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  const handleStartChat = async (user: User) => {
    const res = await getDirectMessageByChatIds({
      userAId: currentUser?.id as string,
      userBId: user.id,
    })

    const chatId = res?.data?._id || `dm-${Date.now()}`
    const chatMembers = res?.data?.members || []
    const otherMembers = chatMembers.filter((m) => m !== currentUser.id)
    const userRes = await getUserDetailsById(otherMembers[0])

    dispatch(
      createDirectMessage({
        chatId,
        createdAt: res?.data?.createdAt,
        currentUserId: currentUser?.id as string,
        isUserOnline: userRes.data.status === "online",
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userAvatar: user.profilePicUrl,
      })
    )

    setOpen(false)
    setSearchQuery("")
  }

  useEffect(() => {
    const source = axios.CancelToken.source()
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers()
        const allUsers = res?.data?.users || []
        const result: User[] = allUsers.map((u) => ({ ...u, id: u._id }))
        dispatch(setListOfUsers({ users: result }))
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message)
        } else {
          console.error("Failed to fetch users:", err)
        }
      }
    }
    fetchUsers()
    return () => {
      // Cleanup function: cancel the axios request if still pending
      source.cancel("Operation canceled by the user.")
    }
  }, [dispatch])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className='w-6 h-6 p-0'>
          <Plus className='w-3 h-3' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Start a conversation</DialogTitle>
          <DialogDescription>Find someone to chat with</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search people...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>

          <div className='max-h-60 overflow-y-auto space-y-2'>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className='flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors'
                onClick={() => handleStartChat(user)}
              >
                <div className='flex items-center gap-3'>
                  <div className='relative'>
                    <Avatar className='w-8 h-8'>
                      <AvatarImage src={user.profilePicUrl} />
                      <AvatarFallback>
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full' />
                    )}
                  </div>
                  <div>
                    <p className='font-medium text-sm'>{user.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {user.email}
                    </p>
                  </div>
                </div>
                {user.isOnline && (
                  <Badge variant='secondary' className='text-xs'>
                    Online
                  </Badge>
                )}
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className='text-center py-8 text-muted-foreground'>
                <p className='text-sm'>No users found</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
