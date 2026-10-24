import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { Message, messageValidator } from '@/lib/validators/message'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'

export async function POST(req: Request) {
  try {
    const [{ text, chatId, messageId }, session] = await Promise.all([
      req.json(),
      getServerSession(authOptions),
    ])

    if (!session) return new Response('Unauthorized', { status: 401 })

    const [userId1, userId2] = chatId.split('--')

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response('Unauthorized', { status: 401 })
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1

    const isFriend = await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      friendId
    )
    if (!isFriend) {
      return new Response('Unauthorized', { status: 401 })
    }

    const timestamp = Date.now()
    const id =
      typeof messageId === 'string' && messageId.length > 0 && messageId.length <= 64
        ? messageId
        : nanoid()

    const messageData: Message = {
      id,
      senderId: session.user.id,
      text,
      timestamp,
    }

    const message = messageValidator.parse(messageData)

    // Batch notifications into one Pusher request while persisting in parallel.
    await Promise.all([
      pusherServer.triggerBatch([
        {
          channel: toPusherKey(`chat:${chatId}`),
          name: 'incoming-message',
          data: message,
        },
        {
          channel: toPusherKey(`user:${friendId}:chats`),
          name: 'new_message',
          data: {
            ...message,
            senderImg: session.user.image ?? '',
            senderName: session.user.name ?? 'Someone',
          },
        },
      ]),
      db.zadd(`chat:${chatId}:messages`, {
        score: timestamp,
        member: JSON.stringify(message),
      }),
    ])

    return new Response('OK')
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
