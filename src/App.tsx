import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ThemeProvider } from "next-themes"
import { type RootState } from "./store/store"
import Index from "./pages/Index"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Chat from "./pages/Chat"
import NotFound from "./pages/NotFound"
import { SocketProvider } from "./context/socketContext"
import {
  loginEnd,
  loginStart,
  loginSuccess,
  logout,
} from "./store/slices/authSlice"
import { useEffect } from "react"
import api from "./api"

const queryClient = new QueryClient()

const App = () => {
  const dispatch = useDispatch()
  const { isLoading, isAuthenticated } = useSelector(
    (s: RootState) => s.auth
  )
  const { user } = useSelector((s: RootState) => s.auth)
  const navigate = useNavigate()

  useEffect(() => {
    // On app load, attempt refresh using cookie
    ;(async () => {
      try {
        const email = sessionStorage.getItem("email")
        const resp = await api.get(
          `/auth/me?email=${user?.email || email}` // TODO: Need to handle unnecessary API call during logout
        ) // axios instance with withCredentials
        const { token, user: userData } = resp.data
        dispatch(loginStart())
        sessionStorage.setItem("token", token)
        if (token && userData) {
          dispatch(
            loginSuccess({
              user: { ...userData, id: userData._id },
              token,
            })
          )

          if (isAuthenticated) navigate("/chat")
        }
      } catch (err) {
        // no valid refresh token — stay logged out
        dispatch(logout())
      } finally {
        dispatch(loginEnd())
      }
    })()
  }, [dispatch, isAuthenticated, navigate, user?.email])

  if (isLoading) return <div>Loading...</div>

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        enableSystem={false}
        disableTransitionOnChange={false}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SocketProvider>
            <Routes>
              <Route path='/' element={<Index />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/chat' element={<Chat />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </SocketProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
