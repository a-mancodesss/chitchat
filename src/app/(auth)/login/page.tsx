'use client'

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useState } from "react"
import toast from "react-hot-toast"
import { MessageSquare } from "lucide-react"

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function loginWithGoogle() {
    setIsLoading(true)
    try {
      await signIn('google')
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong with your login!!!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-green-50'>
      <div className='w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-green-100'>
        <div className='flex flex-col items-center text-center'>
          <div className="rounded-2xl bg-emerald-50 p-4 mb-6">
            <MessageSquare className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            ChitChat
          </h1>
          <h2 className='text-lg text-gray-500 font-medium'>
            Sign in to your account to continue
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            size='lg'
            className="w-full h-14 text-base font-semibold bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-100 hover:border-emerald-100 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
            isLoading={isLoading}
            onClick={loginWithGoogle}
          >
            {!isLoading && (
              <svg
                className='mr-3 h-5 w-5'
                aria-hidden='true'
                focusable='false'
                data-prefix='fab'
                data-icon='github'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
                <path d='M1 1h22v22H1z' fill='none' />
              </svg>
            )}
            Continue with Google
          </Button>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-8">
          By clicking continue, you agree to our <a href="#" className="underline hover:text-emerald-600">Terms of Service</a> and <a href="#" className="underline hover:text-emerald-600">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
