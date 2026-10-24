'use client'

import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[]
  sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter()
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  )

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )
    console.log("listening to ", `user:${sessionId}:incoming_friend_requests`)

    const friendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      console.log("function got called")
      setFriendRequests((prev) => [...prev, { senderId, senderEmail }])
    }

    pusherClient.bind('incoming_friend_requests', friendRequestHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
    }
  }, [sessionId])

  const acceptFriend = async (senderId: string) => {
    await axios.post('/api/friends/accept', { id: senderId })

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    )

    router.refresh()
  }

  const denyFriend = async (senderId: string) => {
    await axios.post('/api/friends/deny', { id: senderId })

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    )

    router.refresh()
  }

  return (
    <>
      {friendRequests.length === 0 ? (
        <div className='flex min-h-64 flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center'>
          <div className='mb-4 rounded-full bg-[#e7f5eb] p-4'>
             <UserPlus className='h-7 w-7 text-[#0e7655]' />
          </div>
          <h3 className='text-lg font-semibold tracking-tight text-[#26372c]'>No pending requests</h3>
          <p className='mt-1 max-w-xs text-sm text-[#819087]'>New friend requests will show up here.</p>
        </div>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className='flex items-center gap-3 rounded-[1.6rem] bg-white p-3 transition-colors sm:gap-4 sm:p-4'>
            <div className='grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e7f5eb]'>
               <UserPlus className='h-5 w-5 text-[#0e7655]' />
            </div>
            
            <div className='min-w-0 flex-1'>
               <p className='truncate text-sm font-semibold text-[#26372c] sm:text-base'>{request.senderEmail}</p>
               <p className='mt-0.5 text-xs text-[#8a988f]'>wants to be your friend</p>
            </div>

            <div className='flex shrink-0 gap-1.5 sm:gap-2'>
              <button
                onClick={() => acceptFriend(request.senderId)}
                aria-label='accept friend'
                className='grid h-10 w-10 place-items-center rounded-full bg-[#0e7655] transition-colors hover:bg-[#0b6549]'>
                <Check className='h-5 w-5 font-semibold text-white' />
              </button>

              <button
                onClick={() => denyFriend(request.senderId)}
                aria-label='deny friend'
                className='grid h-10 w-10 place-items-center rounded-full bg-[#f3f7f3] text-[#76867b] transition-colors hover:bg-[#f7eeee] hover:text-[#a54842]'>
                <X className='h-5 w-5 font-semibold' />
              </button>
            </div>
          </div>
        ))
      )}
    </>
  )
}

export default FriendRequests
