"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is the best time to visit India?",
    answer:
      "The best time to visit India depends on the region. October to March is ideal for most of North India, including the Golden Triangle. Kerala is pleasant year-round, though September to March is optimal. For the Himalayas, April to June and September to November offer the best weather for trekking.",
  },
  {
    question: "Do I need a visa to visit India?",
    answer:
      "Most foreign nationals need a visa to enter India. Many countries are eligible for e-Visa, which can be applied online. We recommend applying at least 4-7 days before your travel date. Our team can provide guidance on visa requirements specific to your nationality.",
  },
  {
    question: "How physically demanding are your tours?",
    answer:
      "Our tours range from leisurely cultural experiences to adventurous treks. Each tour listing specifies the activity level required. We offer options for all fitness levels, from comfortable coach tours to challenging Himalayan expeditions. Our team will help you find the perfect match.",
  },
  {
    question: "What is included in the tour price?",
    answer:
      "Our tour prices typically include accommodation, transportation within India, guided tours, many meals, and entrance fees to monuments. International flights, visa fees, travel insurance, and personal expenses are usually not included. Each tour page details exactly what's covered.",
  },
  {
    question: "Can tours be customized for private groups?",
    answer:
      "Absolutely! We specialize in creating bespoke itineraries for private groups, families, and solo travelers. Whether you want to extend your stay, add specific experiences, or adjust the pace, our travel consultants will craft the perfect journey for you.",
  },
  {
    question: "Is India safe for travelers?",
    answer:
      "India welcomes millions of tourists safely each year. Our local guides ensure you navigate with ease and avoid common tourist pitfalls. We provide 24/7 support, carefully vetted accommodations, and reliable transportation. We also share safety tips and cultural guidance before your trip.",
  },
]

export function FAQ() {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-medium text-sm uppercase tracking-widest mb-4">
            Common Questions
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg text-pretty max-w-2xl mx-auto">
            Planning a trip to India? Here are answers to the most common
            questions from our travelers.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-serif text-lg font-semibold hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
