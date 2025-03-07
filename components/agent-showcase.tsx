"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageSquare, PenTool, ShoppingCart, Calendar, Database, Search, ChevronRight } from "lucide-react"

const agents = [
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Customer Service Agent",
    description:
      "Handle customer inquiries 24/7 with a personalized touch. Resolve issues and escalate when necessary.",
    color: "from-pink-500/20 to-purple-500/20"
  },
  {
    icon: <PenTool className="h-8 w-8" />,
    title: "Content Creation Agent",
    description: "Generate blog posts, social media content, and marketing copy tailored to your brand voice.",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "Sales Assistant Agent",
    description: "Guide customers through your product catalog and help them make informed purchasing decisions.",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Scheduling Agent",
    description: "Manage appointments, meetings, and events with natural language processing capabilities.",
    color: "from-yellow-500/20 to-orange-500/20"
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: "Data Analysis Agent",
    description: "Process and analyze data to extract valuable insights and generate comprehensive reports.",
    color: "from-red-500/20 to-rose-500/20"
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: "Research Agent",
    description: "Conduct thorough research on any topic and compile findings into organized summaries.",
    color: "from-indigo-500/20 to-violet-500/20"
  }
]

export default function AgentShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="agents" ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-white/80 text-lg uppercase tracking-wider mb-2">Meet Our Agents</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white">Pre-built AI Agents</h3>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            Choose from our library of specialized AI agents designed for specific business functions. Each agent can be
            deployed in minutes with minimal configuration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`card-glass rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${agent.color} border border-white/10`}
            >
              <div className="bg-white/10 rounded-full p-4 inline-block mb-4 text-white">{agent.icon}</div>
              <h4 className="text-xl font-semibold text-white mb-2">{agent.title}</h4>
              <p className="text-white/70 mb-4">{agent.description}</p>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 p-0 h-auto flex items-center gap-1 text-sm"
              >
                Learn more <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg">Explore All Agents</Button>
        </motion.div>
      </div>
    </section>
  )
}
