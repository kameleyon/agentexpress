"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code, Zap, Shield, Settings, Layers, BarChart } from "lucide-react"

const features = [
  {
    icon: <Code className="h-8 w-8" />,
    title: "Zero Code Required",
    description:
      "Implement AI agents without writing a single line of code. Our platform handles all the technical complexity.",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Instant Deployment",
    description: "Configure and deploy your AI agents in minutes, not weeks. Get up and running immediately.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Enterprise Security",
    description:
      "Bank-grade security and data protection. Your information and AI interactions remain private and secure.",
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: "Easy Customization",
    description: "Tailor your agents to your specific needs with our intuitive configuration interface.",
  },
  {
    icon: <Layers className="h-8 w-8" />,
    title: "Multi-Agent Workflows",
    description: "Create complex workflows by connecting multiple agents together for sophisticated automation.",
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: "Performance Analytics",
    description: "Track and optimize your agents' performance with comprehensive analytics and insights.",
  },
]

export default function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="features" ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-white/80 text-lg uppercase tracking-wider mb-2">Powerful Capabilities</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white">Why Choose AgentExpress</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="card-glass rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-white/10 rounded-full p-4 inline-block mb-4 text-white group-hover:bg-white/20 transition-colors duration-300">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

