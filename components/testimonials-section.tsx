"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "AgentExpress transformed our customer service operations. We deployed an AI agent in less than a day that now handles 70% of our inquiries.",
    author: "Sarah Johnson",
    position: "Customer Success Manager",
    company: "TechSolutions Inc.",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "As a small business owner, I never thought AI would be accessible to me. AgentExpress changed that completely. Now I have an AI content creator that works 24/7.",
    author: "Michael Chen",
    position: "Founder",
    company: "Artisan Crafts",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "The ROI we've seen from implementing AgentExpress agents has been incredible. Our sales team is now supported by AI assistants that qualify leads automatically.",
    author: "Jessica Rivera",
    position: "Sales Director",
    company: "Global Enterprises",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-white/80 text-lg uppercase tracking-wider mb-2">Success Stories</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white">What Our Clients Say</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="card-glass rounded-xl p-8 shadow-md relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-white/20" />
              <p className="text-white/80 mb-6 relative z-10">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-medium">{testimonial.author}</h4>
                  <p className="text-white/60 text-sm">
                    {testimonial.position}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 flex justify-center items-center space-x-8"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">500+</div>
            <p className="text-white/60">Businesses Powered</p>
          </div>
          <div className="h-12 w-px bg-white/20"></div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">10,000+</div>
            <p className="text-white/60">AI Agents Deployed</p>
          </div>
          <div className="h-12 w-px bg-white/20"></div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
            <p className="text-white/60">Uptime Guarantee</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

