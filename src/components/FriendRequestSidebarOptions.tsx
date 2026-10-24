'use client'

import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface FriendRequestSidebarOptionsProps {
  sessionId: string
  initialUnseenRequestCount: number
}

const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({
  sessionId,
  initialUnseenRequestCount,
}) => {
  const pathname = usePathname()
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  )

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

    const friendRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1)
    }

    const addedFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1)
    }

    pusherClient.bind('incoming_friend_requests', friendRequestHandler)
    pusherClient.bind('new_friend', addedFriendHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

      pusherClient.unbind('new_friend', addedFriendHandler)
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
    }
  }, [sessionId])

  return (
    <Link
      href='/dashboard/requests'
      className={`group flex items-center gap-3 rounded-full px-3 py-2.5 text-sm transition-colors ${pathname === '/dashboard/requests' ? 'bg-[#e7f5eb] font-semibold text-[#0e7655]' : 'font-medium text-[#5f7065] hover:bg-[#edf7f0] hover:text-[#0e7655]'}`}>
      <span className='grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f3f8f4] text-[#789082] transition-colors group-hover:bg-white group-hover:text-[#0e7655]'>
        <User className='h-4 w-4' />
      </span>
      <span className='flex-1 truncate'>Friend requests</span>

      {unseenRequestCount > 0 ? (
        <span className='grid h-5 min-w-5 place-items-center rounded-full bg-[#0e7655] px-1 text-[10px] font-semibold text-white'>
          {unseenRequestCount}
        </span>
      ) : null}
    </Link>
  )
}

export default FriendRequestSidebarOptions
