"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "../../messages.json"

export default function HomePage() {
  const fullText = "Say it without revealing yourself."
  const [displayedText, setDisplayedText] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index])
        setIndex((prev) => prev + 1)
      }, 45)

      return () => clearTimeout(timeout)
    }
  }, [index, fullText])

  return (
    <main className="relative min-h-screen bg-[#0f172a] text-white overflow-hidden pt-28 px-6">

      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-teal-500 blur-3xl opacity-10 rounded-full"></div>

      <section className="flex flex-col items-center text-center max-w-3xl mx-auto">

        <span className="px-4 py-1 text-sm bg-white/5 border border-white/10 rounded-full text-gray-300">
          Anonymous messaging platform
        </span>

        <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight min-h-[80px]">
          {displayedText}
          <span className="animate-pulse text-teal-400">|</span>
        </h1>

        <p className="mt-6 text-gray-400 text-lg max-w-xl">
          Receive honest thoughts. No names. No filters.
        </p>

        <Link href="/sign-up">
          <button className="mt-10 px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition cursor-pointer">
            Get Started
          </button>
        </Link>
      </section>

      
      <section className="flex justify-center mt-20">
        <div className="w-full max-w-md">
          <Carousel plugins={[Autoplay({ delay: 4000 })]}>
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-2">
                    <Card className="bg-white/5 border border-white/10 rounded-2xl">
                      <CardHeader className="font-semibold text-teal-400">
                        {message.title}
                      </CardHeader>
                      <CardContent className="text-center p-6">
                        <p className="text-gray-100">
                          {message.content}
                        </p>
                        <p className="pt-4 text-sm text-gray-300">
                          {message.received}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-white border-white/20" />
            <CarouselNext className="text-white border-white/20" />
          </Carousel>
        </div>
      </section>

      <section className="mt-28 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-teal-400 mb-3">
            100% Anonymous
          </h3>
          <p className="text-gray-400">
            Your identity is never revealed.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-teal-400 mb-3">
            Safe & Secure
          </h3>
          <p className="text-gray-400">
            Messages stay private and protected.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-teal-400 mb-3">
            Instant Delivery
          </h3>
          <p className="text-gray-400">
            Send and receive messages instantly.
          </p>
        </div>

      </section>

      <footer className="mt-28 border-t border-white/10 pt-10 pb-8 text-center text-gray-400 text-sm">

        <div className="mb-4">
          <span className="text-teal-400 font-semibold">Whispr</span> — Speak freely.
        </div>

        <p>
          © {new Date().getFullYear()} Whispr. All rights reserved.
        </p>

      </footer>

    </main>
  )
}