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
    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-md'>
      <label
        htmlFor='email'
        className='block text-sm font-semibold leading-6 text-[#26372c]'>
        Add friend by E-Mail
      </label>

      <div className='mt-3 flex flex-col gap-2 sm:flex-row'>
        <div className='relative min-w-0 flex-1'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
            <Mail className='h-[18px] w-[18px] text-[#91a196]' />
          </div>
          <input
            {...register('email')}
            type='text'
            className='block h-12 w-full rounded-full border-0 bg-[#f7faf7] py-2 pl-11 pr-4 text-sm text-[#26372c] ring-1 ring-inset ring-[#e7eee8] transition-all placeholder:text-[#a1aca4] focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#0e7655] sm:leading-6'
            placeholder='you@example.com'
          />
        </div>
        <Button className='h-12 rounded-full bg-[#0e7655] px-6 text-white shadow-none hover:bg-[#0b6549]'>Add</Button>
      </div>
      {errors.email?.message ? <p className='mt-2 text-sm text-red-600'>{errors.email.message}</p> : null}
      {showSuccessState ? (
        <p className='mt-3 flex items-center gap-2 text-sm font-medium text-[#0e7655]'>
          <span className='inline-block h-2 w-2 rounded-full bg-[#10a96f]' />
          Friend request sent!
        </p>
      ) : null}
    </form>
  )
}

export default AddFriendButton
