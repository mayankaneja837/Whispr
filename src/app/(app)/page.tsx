"use client"
import { Card,CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "../../messages.json"
import Autoplay from 'embla-carousel-autoplay'

const HomePage = ()=>{
  return <main className="flex-grow flex flex-col justify-center items-center py-12 px-4 md:px-24 ">
    <section className="text-center mb-8 md:mb-12">
      <h1 className="text-3xl md:text-5xl font-bold"> Dive into the world of anonymous messages</h1>
      <p className="mt-3 md:mt-4 text-base md:text-lg">Have a conversation with anyone without revealing yourself!</p>
    </section>
      <Carousel className="w-full max-w-xs"
      plugins={[Autoplay({delay:4000})]}
      >
      <CarouselContent>
        {messages.map((message,index)=>(
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader className="font-bold">
                  {message.title}
                </CardHeader>
                <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                  <span className="text-xl font-semibold">{message.content}</span>
                  <span className="pt-2">{message.received}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </main>
}

export default HomePage