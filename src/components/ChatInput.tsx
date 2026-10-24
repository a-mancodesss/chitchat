'use client'

import axios from 'axios'
import { FC, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'
import Button from './Button'
import { User } from '@/types/db'
import { Send } from 'lucide-react'

interface ChatInputProps {
  chatPartner: User
  chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const messageText = input
    setInput('') // Optimistic: clear immediately
    setIsLoading(true)

    try {
      await axios.post('/api/message/send', { text: messageText, chatId })
      textareaRef.current?.focus()
    } catch {
      setInput(messageText) // Rollback on error
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='border-t border-[#edf1ed] px-3 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4'>
      <div className='relative flex-1 overflow-hidden rounded-full bg-[#f7faf7] ring-1 ring-inset ring-[#e7eee8] transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0e7655]'>
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className='block max-h-36 min-h-12 w-full resize-none border-0 bg-transparent py-[14px] pl-5 pr-16 text-sm leading-5 text-[#26372c] placeholder:text-[#a1aca4] focus:outline-none sm:pl-6'
        />

        <div className='absolute right-2 bottom-2'>
          <Button 
            className='flex h-9 w-9 items-center justify-center rounded-full bg-[#0e7655] p-0 text-white shadow-none transition-colors hover:bg-[#0b6549]'
            isLoading={isLoading} 
            onClick={sendMessage} 
            type='submit'
          >
            {!isLoading && <Send className='h-5 w-5 text-white ml-0.5' />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
