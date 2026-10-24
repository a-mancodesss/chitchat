import { getFriendsByUserId } from '@/helper/get-friends-by-user-id'
import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/lib/auth'
import { chatHrefConstructor } from '@/lib/utils'
import { Message } from '@/lib/validators/message'
import { ChevronRight, MessageCircle, UserPlus } from 'lucide-react'
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
    <div className='py-2 md:py-4'>
      <header className='mb-7 flex items-end justify-between gap-4 sm:mb-9'>
        <div>
          <h1 className='text-3xl font-semibold tracking-[-0.055em] text-[#17271f] sm:text-[2.6rem]'>Recent chats</h1>
        </div>
        <Link href='/dashboard/add' aria-label='Add a friend' className='grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0e7655] text-white transition-transform hover:scale-105'><UserPlus className='h-[18px] w-[18px]' /></Link>
      </header>
      {friendsWithLastMessage.length === 0 ? (
        <div className='flex min-h-64 flex-col items-center justify-center rounded-[2rem] bg-white px-6 py-12 text-center'>
          <span className='mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#e7f5eb] text-[#0e7655]'><MessageCircle className='h-6 w-6' /></span>
          <h2 className='text-lg font-semibold tracking-tight text-[#24362a]'>No chats yet.</h2>
          <Link href='/dashboard/add' className='mt-5 rounded-full bg-[#0e7655] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0b6549]'>Find a friend</Link>
        </div>
      ) : (
        <div className='space-y-2'>
        {friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className='group relative rounded-[1.6rem] bg-white p-3 transition-colors hover:bg-[#fbfdfb] sm:p-4'>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className='relative flex items-center gap-3 sm:gap-4'>
              <div className='shrink-0'>
                <div className='relative h-12 w-12 overflow-hidden rounded-full bg-[#edf5ef] sm:h-14 sm:w-14'>
                  <Image
                    referrerPolicy='no-referrer'
                    className='object-cover'
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div className='min-w-0 flex-1 pr-8'>
                <h4 className='truncate text-[15px] font-semibold text-[#26372c] transition-colors group-hover:text-[#0e7655] sm:text-base'>{friend.name}</h4>
                <p className='mt-1 truncate text-sm text-[#829087]'>
                  <span className='font-medium text-[#9aa69d]'>
                    {friend.lastMessage.senderId === session.user.id
                      ? 'You: '
                      : ''}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
              <ChevronRight className='absolute right-1 h-5 w-5 text-[#b3c0b6] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0e7655]' />
            </Link>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}

export default page
