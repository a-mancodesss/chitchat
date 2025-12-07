'use client'

import { addFriendValidator } from '@/lib/validators/add-friend'
import axios, { AxiosError } from 'axios'
import {  useState } from 'react'
import Button from './Button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'


type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton= () => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  })

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email })

      await axios.post('/api/friends/add', {
        email: validatedEmail,
      })

      setShowSuccessState(true)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', { message: error.message })
        return
      }

      if (error instanceof AxiosError) {
        setError('email', { message: error.response?.data })
        return
      }

      setError('email', { message: 'Something went wrong.' })
    }
  }

  const onSubmit = (data: FormData) => {
    addFriend(data.email)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm w-full'>
      <label
        htmlFor='email'
        className='block text-sm font-medium leading-6 text-gray-900'>
        Add friend by E-Mail
      </label>

      <div className='mt-2 flex gap-4'>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('email')}
            type='text'
            className='block w-full rounded-xl border-0 py-2 pl-10 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 transition-all'
            placeholder='you@example.com'
          />
        </div>
        <Button className='rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-sm'>Add</Button>
      </div>
      <p className='mt-2 text-sm text-red-600'>{errors.email?.message}</p>
      {showSuccessState ? (
        <p className='mt-2 text-sm text-emerald-600 font-medium flex items-center gap-1'>
          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"/>
          Friend request sent!
        </p>
      ) : null}
    </form>
  )
}

export default AddFriendButton