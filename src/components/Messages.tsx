'use client'

import { pusherClient } from '@/lib/pusher'
import { cn, toPusherKey } from '@/lib/utils'
import { Message } from '@/lib/validators/message'
import { User } from '@/types/db'
import { format } from 'date-fns'
import Image from 'next/image'
import { FC, useEffect, useRef, useState } from 'react'

interface MessagesProps {
  initialMessages: Message[]
  sessionId: string
  chatId: string
  sessionImg: string | null | undefined
  chatPartner: User
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  chatId,
  chatPartner,
  sessionImg,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`chat:${chatId}`)
    )

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev])
    }

    pusherClient.bind('incoming-message', messageHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`chat:${chatId}`)
      )
      pusherClient.unbind('incoming-message', messageHandler)
    }
  }, [chatId])

  const scrollDownRef = useRef<HTMLDivElement | null>(null)

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm')
  }

  return (
    <div
      id='messages'
      className='flex h-full flex-1 flex-col-reverse gap-4 p-4 overflow-y-auto scrollbar-thumb-emerald-200 scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-w-2 scrolling-touch'>
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
                  'flex flex-col space-y-2 text-base max-w-[75%] md:max-w-[80%] mx-2',
                  {
                    'order-1 items-end': isCurrentUser,
                    'order-2 items-start': !isCurrentUser,
                  }
                )}>
                <span
                  className={cn('px-5 py-2.5 rounded-3xl inline-block shadow-sm', {
                    'bg-emerald-600 text-white': isCurrentUser,
                    'bg-gray-100 text-gray-900': !isCurrentUser,
                    'rounded-br-none':
                      !hasNextMessageFromSameUser && isCurrentUser,
                    'rounded-bl-none':
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}>
                  {message.text}{' '}
                  <span className={cn('ml-2 text-xs opacity-75', {
                    'text-emerald-100': isCurrentUser,
                    'text-gray-500': !isCurrentUser
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
                  className='rounded-full ring-2 ring-white shadow-sm object-cover'
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
