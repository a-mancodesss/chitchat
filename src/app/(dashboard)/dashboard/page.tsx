import { getFriendsByUserId } from '@/helper/get-friends-by-user-id'
import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/lib/auth'
import { chatHrefConstructor } from '@/lib/utils'
import { Message } from '@/lib/validators/message'
import { ChevronRight } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const page = async ({}) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        'zrange',
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[]

      const lastMessage = JSON.parse(lastMessageRaw) as Message

      return {
        ...friend,
        lastMessage,
      }
    })
  )

  return (
    <div className='container  py-12'>
      <h1 className='font-bold text-5xl mb-8 tracking-tight text-gray-900'>Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className='relative bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-lg hover:border-emerald-100 transition-all duration-200 mb-3 group'>
            <div className='absolute right-4 inset-y-0 flex items-center'>
              <ChevronRight className='h-7 w-7 text-gray-300 group-hover:text-emerald-500 transition-colors' />
            </div>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className='relative sm:flex items-center gap-4'>
              <div className='flex-shrink-0'>
                <div className='relative h-12 w-12'>
                  <Image
                    referrerPolicy='no-referrer'
                    className='rounded-full ring-2 ring-white shadow-sm'
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className='text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors'>{friend.name}</h4>
                <p className='mt-1 max-w-md truncate text-sm text-gray-500'>
                  <span className='text-gray-400 font-medium'>
                    {friend.lastMessage.senderId === session.user.id
                      ? 'You: '
                      : ''}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}

export default page
