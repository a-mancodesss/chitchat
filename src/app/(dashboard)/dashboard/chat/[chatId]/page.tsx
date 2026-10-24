import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/lib/auth'
import { messageArrayValidator } from '@/lib/validators/message'
import { Message, User } from '@/types/db'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'
type Params = Promise<{ chatId: string }>

// The following generateMetadata functiion was written after the video and is purely optional
export async function generateMetadata(props:{params:Params}) {
  const params = await props.params
  const session = await getServerSession(authOptions)
  if (!session) notFound()
  const [userId1, userId2] = params.chatId.split('--')
  const { user } = session

  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${chatPartnerId}`
  )) as string
  const chatPartner = JSON.parse(chatPartnerRaw) as User

  return { title: `${chatPartner.name} · ChitChat` }
}
async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    )

    const dbMessages = results.map((message) => JSON.parse(message) as Message)

    const reversedDbMessages = dbMessages.reverse()

    const messages = messageArrayValidator.parse(reversedDbMessages)

    return messages
  } catch (error) {
    console.error(error)
    notFound()
  }
}


export default async function Page(props:{params:Params}) {
  const params = await props.params
  const chatId = params.chatId
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const { user } = session

  const [userId1, userId2] = chatId.split('--')

  if (user.id !== userId1 && user.id !== userId2) {
    notFound()
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  // new

  const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${chatPartnerId}`
  )) as string
  const chatPartner = JSON.parse(chatPartnerRaw) as User
  const initialMessages = await getChatMessages(chatId)

  return (
    <div className='flex h-[calc(100dvh-6.5rem)] flex-col justify-between overflow-hidden rounded-[2rem] bg-white md:h-[calc(100dvh-4rem)]'>
      <div className='sticky top-0 z-10 flex items-center justify-between border-b border-[#edf1ed] bg-white px-4 py-3.5 sm:px-6 sm:py-4'>
        <div className='relative flex min-w-0 items-center gap-3 sm:gap-4'>
          <div className='relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#e7f5eb] sm:h-12 sm:w-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className='object-cover'
              />
          </div>

          <div className='flex min-w-0 flex-col leading-tight'>
            <div className='flex items-center text-base sm:text-lg'>
              <span className='truncate font-semibold tracking-tight text-[#26372c]'>
                {chatPartner.name}
              </span>
            </div>

            <span className='truncate text-xs text-[#89968d] sm:text-sm'>{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  )
}
