import FriendRequests from '@/components/FriendRequests'
import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/lib/auth'
import { User } from '@/types/db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

const page = async () => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  // ids of people who sent current logged in user a friend requests
  const incomingSenderIds = (await fetchRedis(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[]

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis('get', `user:${senderId}`)) as string
      const senderParsed = JSON.parse(sender) as User
      
      return {
        senderId,
        senderEmail: senderParsed.email,
      }
    })
  )

  return (
    <main className='py-2 md:py-4'>
      <header className='mb-7 sm:mb-9'>
        <h1 className='text-3xl font-semibold tracking-[-0.055em] text-[#17271f] sm:text-[2.6rem]'>Friend requests</h1>
      </header>
      <div className='flex max-w-3xl flex-col gap-3'>
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  )
}

export default page
