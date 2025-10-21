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
import { toast } from "@/components/ui/use-toast"
import { useSocket } from "@/context/socketContext"
import api from "@/api"

type FormState = { email: string; password: string }

const initialForm: FormState = { email: "", password: "" }

export default function Login() {
  const [form, setForm] = useState<FormState>(initialForm)
  const socket = useSocket()
  const dispatch = useDispatch()

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
      const { email, password } = form
      const res = await api.post("/auth/signin", { email, password })
      const { token, user } = res.data
      if (user) {
        dispatch(
          loginSuccess({
            user: { ...user, id: user._id },
            token,
          })
        )
        sessionStorage.setItem("email", user.email)
      }
    } catch (err: unknown) {
      console.error("Login error:", err)
      toast({
        title: "Login failed",
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
              Welcome back
            </CardTitle>
            <CardDescription>
              Sign in to your account to continue chatting
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
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
                placeholder='Enter your password'
                value={form.password}
                onChange={onChange}
                required
              />
            </div>
            <Button type='submit' className='w-full'>
              Sign In
            </Button>
          </form>
          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              Don't have an account?{" "}
              <Link to='/signup' className='text-primary hover:underline'>
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
