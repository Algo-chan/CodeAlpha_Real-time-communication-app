import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Video,
  MonitorUp,
  FileCheck2,
  Palette,
  ShieldCheck,
  Zap,
  ArrowRight,
  Mic,
  Camera,
  Share2,
} from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { Button, Avatar } from '../components/ui'
import { useAuthStore } from '../store/auth.store'

export function Landing() {
  const { isAuthenticated } = useAuthStore()

  const features = [
    {
      icon: Video,
      title: 'Ultra-low Latency Video',
      tagline: 'Mesh WebRTC Architecture',
      description:
        'Direct peer-to-peer media streaming with dynamic adaptive bitrate scaling, crystal-clear 1080p, and automated active speaker spotlighting.',
      badge: 'WebRTC P2P',
    },
    {
      icon: Palette,
      title: 'Infinite Canvas Whiteboard',
      tagline: 'Multi-User Vector Engine',
      description:
        'Brainstorm together in real-time. Features shape snapping, pressure-sensitive strokes, sub-pixel normalization, and high-fidelity PNG export.',
      badge: 'Real-Time Sync',
    },
    {
      icon: MonitorUp,
      title: 'Fluid Screen Sharing',
      tagline: 'Seamless Window & Tab Audio',
      description:
        'Share entire displays, individual application windows, or browser tabs with zero frame tearing and automated layout repositioning.',
      badge: 'Zero Renegotiation',
    },
    {
      icon: FileCheck2,
      title: 'Encrypted File Transfer',
      tagline: 'AES-256-GCM Vault',
      description:
        'Drag and drop documents, code snippets, and assets directly into the conference. Every payload is encrypted at rest and served via authenticated signed URLs.',
      badge: 'End-to-End Auth',
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Compromise Security',
      tagline: 'DTLS-SRTP & Strict CSP',
      description:
        'Strict Content Security Policies, sanitized database inputs, rate-limited sockets, and rotating cryptographic tokens protect every session.',
      badge: 'Production Hardened',
    },
    {
      icon: Zap,
      title: 'Apple-Grade Polish',
      tagline: 'Fluid Spring Physics',
      description:
        'Designed around spatial hierarchy, frosted optical materials, natural tactile springs, and WCAG AA accessible contrast across all devices.',
      badge: 'Human Interface',
    },
  ]

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-accent/20 selection:text-accent">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-accent/15 via-blue-400/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-accent-muted text-accent text-footnote font-medium mb-6 border border-accent/20"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Introducing CollabRoom 1.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-label leading-[1.08] max-w-4xl mx-auto"
          >
            Connect effortlessly. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">
              Collaborate in real time.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mt-6 text-lg sm:text-xl text-label-secondary max-w-2xl mx-auto leading-relaxed"
          >
            A high-performance video conferencing sanctuary built with WebRTC mesh,
            synchronized vector whiteboards, and encrypted file sharing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to={isAuthenticated ? '/dashboard' : '/auth?mode=signup'}>
              <Button size="lg" rightIcon={ArrowRight} className="shadow-lg shadow-accent/20">
                {isAuthenticated ? 'Open Dashboard' : 'Start Free Meeting'}
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg">
                Explore Technology
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Floating Product Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
          className="mt-16 max-w-5xl mx-auto px-2 sm:px-4"
        >
          <div className="relative rounded-card glass-panel bg-surface-elevated/70 p-3 sm:p-5 shadow-floating border border-separator/50 overflow-hidden">
            {/* Header Mockup */}
            <div className="flex items-center justify-between pb-4 border-b border-separator/30 px-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-caption-1 font-mono text-label-secondary">
                  room/abc-defg-hij
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-system-success-muted text-system-success text-caption-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-system-success" />
                  Live WebRTC Mesh
                </span>
              </div>
            </div>

            {/* Video Grid Simulation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
              {/* Tile 1: Active Speaker */}
              <div className="relative aspect-video rounded-tile bg-neutral-900 border-2 border-accent shadow-md overflow-hidden flex items-center justify-center group">
                <Avatar name="Sarah Jenkins" size="xl" />
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-pill glass-toolbar text-white text-caption-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-system-success animate-ping" />
                  Sarah Jenkins (Speaking)
                </div>
              </div>

              {/* Tile 2 */}
              <div className="relative aspect-video rounded-tile bg-neutral-800 border border-separator/30 overflow-hidden flex items-center justify-center">
                <Avatar name="David Chen" size="xl" />
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-pill glass-toolbar text-white text-caption-1 flex items-center gap-1.5">
                  David Chen
                </div>
              </div>

              {/* Tile 3 */}
              <div className="relative aspect-video rounded-tile bg-neutral-850 border border-separator/30 overflow-hidden flex items-center justify-center">
                <Avatar name="Elena Rostova" size="xl" />
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-pill glass-toolbar text-white text-caption-1 flex items-center gap-1.5">
                  Elena Rostova
                </div>
              </div>
            </div>

            {/* Floating Control Bar Mockup */}
            <div className="py-2 flex justify-center">
              <div className="glass-toolbar rounded-pill px-4 py-2 flex items-center gap-3 shadow-md border border-separator/40">
                <div className="p-2 rounded-full bg-surface-elevated text-label">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="p-2 rounded-full bg-surface-elevated text-label">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="p-2 rounded-full bg-accent text-white">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="h-4 w-px bg-separator/50" />
                <div className="px-3 py-1 rounded-pill bg-system-destructive text-white text-caption-1 font-semibold">
                  Leave
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-20 bg-surface-elevated/40 border-t border-separator/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-large-title font-bold tracking-tight text-label">
              Engineered with Precision
            </h2>
            <p className="mt-3 text-body text-label-secondary">
              Every detail is calibrated for reliability, privacy, and frictionless collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="glass-panel p-6 rounded-card border border-separator/40 hover:border-accent/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-accent-muted text-accent flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-caption-1 font-mono text-label-secondary px-2 py-0.5 rounded-pill bg-surface-elevated border border-separator/20">
                        {feature.badge}
                      </span>
                    </div>
                    <h3 className="text-title-2 text-label mb-1">{feature.title}</h3>
                    <p className="text-caption-1 font-medium text-accent mb-3">
                      {feature.tagline}
                    </p>
                    <p className="text-footnote text-label-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-separator/30 py-10 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-footnote text-label-secondary">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center text-white">
              <Video className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-label">CollabRoom</span>
            <span>— Production-Grade Real-Time Communications</span>
          </div>
          <div>
            Built with WebRTC, Socket.io, React & Node.js
          </div>
        </div>
      </footer>
    </div>
  )
}
