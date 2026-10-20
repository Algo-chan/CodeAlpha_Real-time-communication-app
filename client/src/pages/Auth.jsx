import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react'
import { Button, Input, SegmentedControl, useToast } from '../components/ui'
import { useAuthStore } from '../store/auth.store'
import api from '../lib/api'

export function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { setAuth, isAuthenticated } = useAuthStore()

  // Query param mode support (?mode=signup)
  const searchParams = new URLSearchParams(location.search)
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'

  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || '/dashboard'
      navigate(destination, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const validateForm = () => {
    const newErrors = {}
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (mode === 'signup' && (!name || name.trim().length < 2)) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login'
      const payload = mode === 'signup' ? { email, password, name } : { email, password }
      const { data } = await api.post(endpoint, payload)

      setAuth(data.user, data.accessToken)
      toast.success(mode === 'signup' ? 'Account created successfully!' : 'Welcome back!')

      const destination = location.state?.from?.pathname || '/dashboard'
      navigate(destination, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Authentication failed'
      toast.error(msg)
      if (err.response?.data?.details) {
        const fieldErrors = {}
        err.response.data.details.forEach((d) => {
          fieldErrors[d.field] = d.message
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Brand Header */}
      <Link to="/" className="mb-8 flex items-center gap-2.5 group">
        <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
          <Video className="w-5 h-5" />
        </div>
        <span className="text-large-title font-bold tracking-tight text-label">
          Collab<span className="text-accent">Room</span>
        </span>
      </Link>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="w-full max-w-md glass-panel bg-surface/90 rounded-card p-6 sm:p-8 shadow-floating border border-separator/40 relative z-10"
      >
        <div className="flex justify-center mb-6">
          <SegmentedControl
            options={[
              { value: 'login', label: 'Sign in' },
              { value: 'signup', label: 'Create account' },
            ]}
            value={mode}
            onChange={(newMode) => {
              setMode(newMode)
              setErrors({})
            }}
          />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-title-2 font-bold text-label">
            {mode === 'signup' ? 'Start collaborating' : 'Welcome back'}
          </h2>
          <p className="text-footnote text-label-secondary mt-1">
            {mode === 'signup'
              ? 'Join millions holding secure real-time conferences.'
              : 'Sign in to access your recent rooms and scheduled calls.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  label="Full Name"
                  leftIcon={UserIcon}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  required={mode === 'signup'}
                  placeholder="e.g. Alex Morgan"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            label="Email Address"
            type="email"
            leftIcon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
            placeholder="alex@example.com"
          />

          <Input
            label="Password"
            type="password"
            leftIcon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            placeholder="Min. 8 characters"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            rightIcon={ArrowRight}
            className="w-full mt-2"
          >
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-footnote text-label-secondary hover:text-label transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
