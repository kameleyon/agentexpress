"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for small businesses and entrepreneurs",
    features: ["2 AI Agents", "5000 interactions/month", "Basic customization", "Email support", "Standard analytics"],
    highlighted: false
  },
  {
    name: "Professional",
    price: "$149",
    description: "Ideal for growing businesses with multiple needs",
    features: [
      "5 AI Agents",
      "25000 interactions/month",
      "Advanced customization",
      "Priority support",
      "Advanced analytics",
      "Multi-agent workflows",
      "API access"
    ],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with complex requirements",
    features: [
      "Unlimited AI Agents",
      "Unlimited interactions",
      "Full customization",
      "24/7 dedicated support",
      "Custom analytics dashboard",
      "Advanced security features",
      "Custom integrations",
      "Dedicated account manager"
    ],
    highlighted: false
  }
]

export default function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="pricing" ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-white/80 text-lg uppercase tracking-wider mb-2">Simple Pricing</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white">Choose Your Plan</h3>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. All plans include access to our platform and regular updates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`card-glass rounded-xl p-8 shadow-md relative ${
                plan.highlighted ? "border-2 border-white/30 transform md:-translate-y-4" : "border border-white/10"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-primary px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-white/60 ml-1 mb-1">/month</span>}
              </div>
              <p className="text-white/70 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-white mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={
                  plan.highlighted
                    ? "bg-white text-primary hover:bg-white/90 w-full"
                    : "bg-white/10 text-white hover:bg-white/20 w-full"
                }
              >
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
