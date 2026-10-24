'use client'

import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import UnseenChatToast from './UnseenChatToast'
import { User } from '@/types/db'
import { Message } from '@/lib/validators/message'
import Image from 'next/image'
import Link from 'next/link'

interface SidebarChatListProps {
  friends: User[]
  sessionId: string
}

interface ExtendedMessage extends Message {
  senderImg: string
  senderName: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  const [activeChats, setActiveChats] = useState<User[]>(friends)

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

    const newFriendHandler = (newFriend: User) => {
      setActiveChats((prev) => [...prev, newFriend])
    }

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`

      if (!shouldNotify) return

      // should be notified
      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ))

      setUnseenMessages((prev) => [...prev, message])
    }

    pusherClient.bind('new_message', chatHandler)
    pusherClient.bind('new_friend', newFriendHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

      pusherClient.unbind('new_message', chatHandler)
      pusherClient.unbind('new_friend', newFriendHandler)
    }
  }, [pathname, sessionId, router])

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  }, [pathname])

  return (
    <ul role='list' className='-mx-1 max-h-[min(48vh,32rem)] space-y-1 overflow-y-auto pr-1'>
      {activeChats.slice().sort((a, b) => a.name.localeCompare(b.name)).map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id
        }).length
        const href = `/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`
        const isActive = pathname === href

        return (
          <li key={friend.id}>
            <Link
              href={href}
              className={`group flex items-center gap-3 rounded-full px-2.5 py-2 text-sm transition-colors ${isActive ? 'bg-[#e7f5eb] font-semibold text-[#0e7655]' : 'font-medium text-[#65756a] hover:bg-[#f1f7f2] hover:text-[#0e7655]'}`}>
              <span className='relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#edf5ef]'>
                <Image fill src={friend.image} alt='' referrerPolicy='no-referrer' className='object-cover' />
              </span>
              <span className='min-w-0 flex-1 truncate'>{friend.name}</span>
              {unseenMessagesCount > 0 ? (
                <span className='grid h-5 min-w-5 place-items-center rounded-full bg-[#0e7655] px-1 text-[10px] font-semibold text-white'>
                  {unseenMessagesCount}
                </span>
              ) : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default SidebarChatList
