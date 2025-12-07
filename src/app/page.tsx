import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, Zap, Shield, Globe } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="sm:container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">ChitChat</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors hidden sm:block">
              Sign In
            </Link>
            <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 shadow-lg shadow-gray-900/20 transition-all hover:scale-105">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-50 rounded-full blur-3xl -z-10 opacity-50" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-50" />
        
        <div className="sm:container mx-auto text-center max-w-4xl relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-8 border border-emerald-100 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            V 2.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
            Connect Instantly, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Chat Seamlessly
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the future of communication with ChitChat. Real-time messaging that feels natural, fast, and securely connects you to the world.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl shadow-emerald-600/20 transition-all hover:scale-105 w-full sm:w-auto">
              <Link href="/login">Start Chatting Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg border-2 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 text-gray-700 rounded-full transition-all w-full sm:w-auto">
              <Link href="https://github.com/a-mancodesss/chitchat" target="_blank">View on GitHub</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-sm:hidden py-8 bg-white relative">
        <div className="sm:container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Real-time message delivery with zero latency. Your conversations flow naturally without interruption.",
                color: "bg-amber-50 text-amber-600"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "End-to-end protection for your messages. Your data stays yours, always protected and private.",
                color: "bg-emerald-50 text-emerald-600"
              },
              {
                icon: Globe,
                title: "Global Reach",
                desc: "Connect with friends and family anywhere in the world. Breaking barriers, one message at a time.",
                color: "bg-blue-50 text-blue-600"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section
      <section className="py-20 px-6 bg-gray-50/50">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-gray-200 border border-gray-100 -rotate-1 hover:rotate-0 transition-transform duration-500 ease-out">
            <div className="bg-gray-50 rounded-[2rem] overflow-hidden aspect-[16/9] relative flex items-center justify-center border border-gray-100">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-purple-500/5" />
               <div className="text-center p-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-lg mb-6 animate-bounce">
                    <MessageSquare className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Ready to connect?</h3>
                  <p className="text-gray-500 mb-8">Join thousands of users already chatting on ChitChat.</p>
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-emerald-600/25">
                    <Link href="/login">Create Free Account</Link>
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-white py-4  border-t border-gray-100 text-center">
       Built by <Link href="https://amanbagale.vercel.app" target="_blank" className="text-emerald-600 hover:text-emerald-700 transition-colors">Aman</Link>
      </footer>
    </div>
  )
}
