import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="parent">
      <div className="container mx-auto px-4 py-8 flex flex-col justify-between">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-lime-600 md:text-5xl lg:text-6xl">
            ChitChat
          </h1>
          <p className="text-xl text-lime-600 mt-2">Realtime chat app!</p>
        </header>

        <main className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:text-3xl">
            Connect Instantly, Chat Seamlessly
          </h2>
          <p className="text-gray-600 mb-8 md:text-lg">
            Experience the future of communication with ChitChat. Our realtime chat app brings people together, no matter where they are in the world.
          </p>
          <Button className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-[1.05]">
            <Link href="/login"> 
            Get Started
            </Link>
          </Button>
        </main>

        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; 2023 ChitChat - Aman Partel</p>
        </footer>
      </div>
    </div>
  )
}