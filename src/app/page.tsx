import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import BrandMark from '@/components/BrandMark'

export default function LandingPage() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#f7faf5] text-[#17271f]">
      <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-9 sm:py-7 lg:px-14">
        <Link href="/" aria-label="ChitChat home" className="inline-flex items-center gap-2.5">
          <BrandMark className="page-enter h-3.5 w-3.5 shrink-0" />
          <span className="page-enter page-enter-1 text-[17px] font-semibold tracking-[-0.04em]">chitchat</span>
        </Link>
        <Link href="/login" className="page-enter page-enter-2 rounded-full px-4 py-2 text-sm font-medium text-[#53665a] transition-colors hover:bg-white/80 hover:text-[#0e7655] sm:px-5">
          Sign in
        </Link>
      </header>

      <main className="mx-auto grid w-full max-w-[1440px] flex-1 content-start items-center gap-1 px-5 pb-8 pt-10 sm:px-9 sm:pb-12 md:content-center md:grid-cols-[0.88fr_1.12fr] md:gap-2 md:pt-2 lg:grid-cols-[0.88fr_1.12fr] lg:gap-0 lg:px-14 lg:py-5">
        <section className="page-enter relative z-10 flex flex-col items-start pb-0 pt-6 sm:pt-10 lg:pb-16 lg:pt-0">
          <h1 className="page-enter page-enter-2 max-w-xl text-[clamp(3.3rem,8vw,7.5rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-[#17271f]">
            Start<br className="hidden lg:block" /> chatting.
          </h1>
          <Button asChild size="lg" className="page-enter page-enter-3 mt-8 h-14 rounded-full bg-[#0e7655] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#0b6549] sm:mt-10 sm:h-16 sm:px-8 sm:text-base">
            <Link href="/login" className="gap-3">
              Start chatting
              <ArrowUpRight className="page-enter page-enter-4 h-[18px] w-[18px]" />
            </Link>
          </Button>
        </section>

        <div className="page-enter page-enter-2 relative mx-auto mt-2 w-full max-w-[700px] md:mt-0 lg:max-w-[760px]">
          <Image
            src="/chitchat-mascot.png"
            alt="ChitChat's friendly mascot ready to talk"
            width={1299}
            height={1211}
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 75vw, 58vw"
            priority
            className="mascot-float relative mx-auto h-auto w-full object-contain"
          />
        </div>
      </main>

    </div>
  )
}
