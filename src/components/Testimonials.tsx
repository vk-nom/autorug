"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Sarah Thompson",
    role: "CEO at TechCorp",
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "AutoRug has revolutionized our workflow. It's intuitive, powerful, and has significantly boosted our team's productivity.",
  },
  {
    name: "John Davis",
    role: "Marketing Director at GrowthHub",
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "The analytics features in AutoRug have provided us with invaluable insights. It's been a game-changer for our marketing strategies.",
  },
  {
    name: "Emily Chen",
    role: "Product Manager at InnovateCo",
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "The collaboration tools in AutoRug have made remote work seamless for our team. It's an essential part of our daily operations now.",
  },
]

export default function Testimonials() {
  return (
    <div className="bg-secondary py-16 sm:py-24 relative overflow-hidden" id="testimonials">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-16 w-32 h-32 bg-primary-light rounded-full"
          animate={{
            y: [0, -20, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-16 w-24 h-24 bg-secondary-light rounded-full"
          animate={{
            y: [0, 30, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">Trusted by businesses worldwide</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Here's what our satisfied customers have to say about AutoRug
          </p>
        </motion.div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-background border border-border shadow-lg rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="px-6 py-8">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                  />
                  <div className="ml-4">
                    <div className="text-lg font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground italic">"{testimonial.quote}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

