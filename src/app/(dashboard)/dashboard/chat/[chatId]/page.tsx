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

  return { title: `FriendZone | ${chatPartner.name} chat` }
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
    <div className='flex-1 bg-red-500 justify-between flex flex-col  max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
      <div className='flex sm:items-center justify-between py-4 px-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10'>
        <div className='relative flex items-center gap-4'>
          <div className='relative'>
            <div className='relative w-10 sm:w-12 h-10 sm:h-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className='rounded-full ring-2 ring-emerald-50 object-cover'
              />
            </div>
          </div>

          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-900 font-bold'>
                {chatPartner.name}
              </span>
            </div>

            <span className='text-sm text-gray-500 font-medium'>{chatPartner.email}</span>
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
