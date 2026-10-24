'use client'

import { cn } from '@/lib/utils'
import { Message } from '@/lib/validators/message'
import { User } from '@/types/db'
import { format } from 'date-fns'
import Image from 'next/image'
import { FC, useRef } from 'react'

interface MessagesProps {
  messages: Message[]
  sessionId: string
  sessionImg: string | null | undefined
  chatPartner: User
}

const Messages: FC<MessagesProps> = ({
  messages,
  sessionId,
  chatPartner,
  sessionImg,
}) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null)

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm')
  }

  return (
    <div
      id='messages'
      className='flex h-full flex-1 flex-col-reverse gap-3 overflow-y-auto bg-white px-3 py-5 scrollbar-thumb-emerald-200 scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-w-2 scrolling-touch sm:gap-4 sm:px-5 sm:py-6'>
      <div ref={scrollDownRef} />

      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId

        return (
          <div
            className='chat-message'
            key={`${message.id}-${message.timestamp}`}>
            <div
              className={cn('flex items-end', {
                'justify-end': isCurrentUser,
              })}>
              <div
                className={cn(
                  'mx-2 flex max-w-[82%] flex-col space-y-2 text-[15px] leading-6 sm:max-w-[76%]',
                  {
                    'order-1 items-end': isCurrentUser,
                    'order-2 items-start': !isCurrentUser,
                  }
                )}>
                <span
                  className={cn('inline-block rounded-[1.4rem] px-4 py-2.5 sm:px-5', {
                    'bg-[#0e7655] text-white': isCurrentUser,
                    'bg-[#eff7f0] text-[#26372c]': !isCurrentUser,
                    'rounded-br-none':
                      !hasNextMessageFromSameUser && isCurrentUser,
                    'rounded-bl-none':
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}>
                  {message.text}{' '}
                  <span className={cn('ml-2 text-xs opacity-75', {
                    'text-[#c8e9d5]': isCurrentUser,
                    'text-[#8c9a90]': !isCurrentUser
                  })}>
                    {formatTimestamp(message.timestamp)}
                  </span>
                </span>
              </div>

              <div
                className={cn('relative w-9 h-9 flex-shrink-0', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}>
                <Image
                  fill
                  src={
                    isCurrentUser ? (sessionImg as string) : chatPartner.image
                  }
                  alt='Profile picture'
                  referrerPolicy='no-referrer'
                  className='rounded-full object-cover'
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Messages
