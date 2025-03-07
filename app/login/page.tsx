"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#5b0000] to-[#df5904] relative overflow-hidden">
      {/* Background Logo */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agentExpress%20%283%29-Hs5PY4UaosokwqP7xYBJsKWAqIU8md.png"
          alt="Logo"
          width={600}
          height={600}
          className="object-contain"
        />
      </motion.div>

      <Card className="w-full max-w-md mx-4 p-8 shadow-lg bg-white/10 backdrop-blur-md border-white/20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-center mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agentExpress%20%283%29-Hs5PY4UaosokwqP7xYBJsKWAqIU8md.png"
              alt="AgentExpress Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                required
                className="bg-white/20 border-white/30 text-white placeholder-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                disabled={isLoading}
                required
                className="bg-white/20 border-white/30 text-white"
              />
            </div>

            <Button className="w-full bg-black text-white hover:bg-black/90" disabled={isLoading}>
              {isLoading ? "Signing in..." : "SIGN IN"}
            </Button>

            <div className="text-center text-sm">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Forgot password?
              </a>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-white/80">
            Don't have an account?{" "}
            <a href="/signup" className="text-white hover:underline">
              Sign up
            </a>
          </div>
        </motion.div>
      </Card>
    </div>
  )
}

