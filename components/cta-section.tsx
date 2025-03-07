"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CtaSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="card-glass rounded-xl p-12 shadow-lg max-w-4xl mx-auto text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#5b0000]/30 to-[#df5904]/30 z-0"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Business with AI?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Start your 14-day free trial today. No credit card required. Experience the power of plug-and-play AI
              agents.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 flex items-center gap-2">
                Get Started Now <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

