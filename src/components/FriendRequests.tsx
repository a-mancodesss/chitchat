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
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
             <UserPlus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No pending requests</h3>
          <p className="text-sm text-gray-500 mt-1">When people send you a friend request, it will appear here.</p>
        </div>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className='flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all'>
            <div className="bg-emerald-50 p-3 rounded-xl">
               <UserPlus className='text-emerald-600 h-6 w-6' />
            </div>
            
            <div className="flex-1">
               <p className='font-semibold text-lg text-gray-900'>{request.senderEmail}</p>
               <p className="text-xs text-gray-500">wants to be your friend</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => acceptFriend(request.senderId)}
                aria-label='accept friend'
                className='w-10 h-10 bg-emerald-600 hover:bg-emerald-700 grid place-items-center rounded-xl transition hover:shadow-md shadow-sm'>
                <Check className='font-semibold text-white w-5 h-5' />
              </button>

              <button
                onClick={() => denyFriend(request.senderId)}
                aria-label='deny friend'
                className='w-10 h-10 bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-600 grid place-items-center rounded-xl transition hover:shadow-md shadow-sm'>
                <X className='font-semibold w-5 h-5' />
              </button>
            </div>
          </div>
        ))
      )}
    </>
  )
}

export default FriendRequests