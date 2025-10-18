import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { loginSuccess } from "@/store/slices/authSlice"
import { MessageCircle } from "lucide-react"
import { registerUser } from "@/api/index"
import { toast } from "@/components/ui/use-toast"
import { useSocket } from "@/context/socketContext"

type FormState = { name: string; email: string; password: string }

const initialForm: FormState = { name: "", email: "", password: "" }

export default function Signup() {
  const [form, setForm] = useState<FormState>(initialForm)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const socket = useSocket()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [e.target.id]: e.target.value }))

  const extractMessage = (err: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = err
    return (
      e?.response?.data?.message ||
      e?.message ||
      "An unknown error occurred"
    )
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    try {
      const { name, email, password } = form
      const profilePicUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      const res = await registerUser({
        name,
        email,
        password,
        profilePicUrl,
      })
      const user = res?.data?.user
      if (!user) {
        console.error("registerUser: unexpected response", res)
        toast({
          title: "Signup failed",
          description: "Unexpected server response.",
        })
        return
      }
      socket.emit("user:join", user._id)
      dispatch(loginSuccess({ ...user, id: user._id }))
      navigate("/chat")
    } catch (err: unknown) {
      console.error("Signup error:", err)
      toast({
        title: "Signup error",
        description: String(extractMessage(err)),
        variant: "destructive",
      })
    }
  }

  return (
    <div className='min-h-screen bg-gradient-chat flex items-center justify-center p-4'>
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>

      <Card className='w-full max-w-md shadow-elevation'>
        <CardHeader className='text-center space-y-4'>
          <div className='mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center'>
            <MessageCircle className='w-6 h-6 text-primary-foreground' />
          </div>
          <div>
            <CardTitle className='text-2xl font-bold'>
              Create account
            </CardTitle>
            <CardDescription>Join our chat community</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                type='text'
                placeholder='Enter your full name'
                value={form.name}
                onChange={onChange}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                value={form.email}
                onChange={onChange}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Create a password'
                value={form.password}
                onChange={onChange}
                required
              />
            </div>

            <Button type='submit' className='w-full'>
              Create Account
            </Button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              Already have an account?{" "}
              <Link to='/login' className='text-primary hover:underline'>
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
