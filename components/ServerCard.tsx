/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState, useEffect, useCallback, ReactNode } from 'react'
import { MapIcon, UsersIcon, GamepadIcon, CopyIcon, PlayIcon, LayersIcon, RefreshCwIcon, ChevronDownIcon } from 'lucide-react'
import { motion, MotionProps } from 'framer-motion'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Define the button variants
type ButtonVariant = 'default' | 'outline' | 'connect' | 'icon'

// Combine ButtonHTMLAttributes and MotionProps using Omit to resolve conflicts
type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart'> & MotionProps & {
  variant?: ButtonVariant
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'default', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variantStyles: Record<ButtonVariant, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    connect: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700',
    icon: 'bg-transparent text-muted-foreground hover:text-foreground'
  }
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variantStyles[variant]} h-10 py-2 px-4 ${className} transition-all duration-200`}
      {...props} // Spread props safely
    >
      {children}
    </motion.button>
  )
}

// Example Card component
const Card: React.FC<Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart'> & MotionProps> = ({ children, className = '', ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={`rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </motion.div>
)

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
)

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
)

const PlayerCountBar: React.FC<{ currentPlayers: number; maxPlayers: number }> = ({ currentPlayers, maxPlayers }) => {
  const widthPercentage = Math.min((currentPlayers / maxPlayers) * 100, 100)

  return (
    <div className="w-full mt-4">
      <div className="relative h-6 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${widthPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-white opacity-20"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: `${widthPercentage}%`, opacity: 0.2 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white mix-blend-difference">
          {currentPlayers}/{maxPlayers} Players ({Math.round(widthPercentage)}%)
        </span>
      </div>
    </div>
  )
}

const PingIndicator: React.FC<{ ping: number }> = ({ ping }) => {
  const getBarColor = (threshold: number) => {
    if (ping < 50) return 'bg-green-500'
    if (ping < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex items-end h-5 space-x-1 mr-2">
      <motion.div
        className={`w-1 ${getBarColor(80)}`}
        initial={{ height: 0 }}
        animate={{ height: '20%' }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <motion.div
        className={`w-1 ${ping < 80 ? getBarColor(50) : 'bg-gray-300'}`}
        initial={{ height: 0 }}
        animate={{ height: '60%' }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      <motion.div
        className={`w-1 ${ping < 50 ? getBarColor(50) : 'bg-gray-300'}`}
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
    </div>
  )
}

interface ServerProps {
  server: {
    name: string
    map: string
    numPlayers: number
    maxPlayers: number
    ping: number
    connect: string
  }
  onRefresh: () => Promise<{
    name: string
    numPlayers: number
    maxPlayers: number
    ping: number
  }>
}

export default function ServerCard({ server: initialServer, onRefresh }: ServerProps) {
  const [server, setServer] = useState(initialServer)
  const [playerCountHistory, setPlayerCountHistory] = useState<{ time: string; count: number }[]>([])

  const updateServerInfo = useCallback(async () => {
    try {
      const updatedInfo = await onRefresh()
      setServer(prevServer => ({
        ...prevServer,
        ...updatedInfo
      }))

      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setPlayerCountHistory(prev => [...prev, { time, count: updatedInfo.numPlayers }].slice(-30))
    } catch (error) {
      console.error('Failed to refresh server info:', error)
    }
  }, [onRefresh])

  useEffect(() => {
    updateServerInfo()
    const intervalId = setInterval(updateServerInfo, 30000)
    return () => clearInterval(intervalId)
  }, [updateServerInfo])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{server.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <PlayerCountBar currentPlayers={server.numPlayers} maxPlayers={server.maxPlayers} />
      </CardContent>
    </Card>
  )
}