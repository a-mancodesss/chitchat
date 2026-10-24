'use client'

import axios from 'axios'
import { nanoid } from 'nanoid'
import { FC, useEffect, useState } from 'react'
import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { Message } from '@/lib/validators/message'
import { User } from '@/types/db'

interface ChatProps {
  chatId: string
  chatPartner: User
  initialMessages: Message[]
  sessionId: string
  sessionImg: string | null | undefined
}

const Chat: FC<ChatProps> = ({
  chatId,
  chatPartner,
  initialMessages,
  sessionId,
  sessionImg,
}) => {
  const [messages, setMessages] = useState(initialMessages)

  useEffect(() => {
    const channel = toPusherKey(`chat:${chatId}`)
    const messageHandler = (message: Message) => {
      setMessages((current) =>
        current.some((existing) => existing.id === message.id)
          ? current
          : [message, ...current]
      )
    }

    pusherClient.subscribe(channel)
    pusherClient.bind('incoming-message', messageHandler)

    return () => {
      pusherClient.unsubscribe(channel)
      pusherClient.unbind('incoming-message', messageHandler)
    }
  }, [chatId])

  const sendMessage = async (text: string) => {
    const optimisticMessage: Message = {
      id: nanoid(),
      senderId: sessionId,
      text,
      timestamp: Date.now(),
    }

    setMessages((current) => [optimisticMessage, ...current])

    try {
      await axios.post('/api/message/send', {
        text,
        chatId,
        messageId: optimisticMessage.id,
      })
    } catch (error) {
      setMessages((current) =>
        current.filter((message) => message.id !== optimisticMessage.id)
      )
      throw error
    }
  }

  return (
    <>
      <Messages
        messages={messages}
        chatPartner={chatPartner}
        sessionImg={sessionImg}
        sessionId={sessionId}
      />
      <ChatInput chatPartner={chatPartner} onSend={sendMessage} />
    </>
  )
}

export default Chat
