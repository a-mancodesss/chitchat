import { chatHrefConstructor, cn } from '@/lib/utils'
import Image from 'next/image'
import { FC } from 'react'
import { toast, type Toast } from 'react-hot-toast'
import { X } from 'lucide-react'

interface UnseenChatToastProps {
  t: Toast
  sessionId: string
  senderId: string
  senderImg: string
  senderName: string
  senderMessage: string
}

const UnseenChatToast: FC<UnseenChatToastProps> = ({
  t,
  senderId,
  sessionId,
  senderImg,
  senderName,
  senderMessage,
}) => {
  return (
    <div
      className={cn(
        'max-w-md w-full pointer-events-auto flex rounded-[1.5rem] border border-[#e5eee7] bg-white shadow-[0_18px_50px_-24px_rgba(28,62,42,0.35)]',
        { 'animate-enter': t.visible, 'animate-leave': !t.visible }
      )}>
      <a
        onClick={() => toast.dismiss(t.id)}
        href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
        className='w-0 flex-1 p-3 sm:p-4'>
        <div className='flex items-start'>
            <div className='shrink-0 pt-0.5'>
            <div className='relative h-10 w-10 overflow-hidden rounded-full bg-[#e7f5eb]'>
              <Image
                fill
                referrerPolicy='no-referrer'
                className='object-cover'
                src={senderImg}
                alt={`${senderName} profile picture`}
              />
            </div>
          </div>

          <div className='ml-3 min-w-0 flex-1'>
            <p className='truncate text-sm font-semibold text-[#26372c]'>{senderName}</p>
            <p className='mt-1 truncate text-sm text-[#849188]'>{senderMessage}</p>
          </div>
        </div>
      </a>

      <div className='flex items-center px-2'>
        <button
          onClick={() => toast.dismiss(t.id)}
          aria-label='Close notification'
          className='grid h-9 w-9 place-items-center rounded-full text-[#90a096] transition-colors hover:bg-[#f3f8f4] hover:text-[#26372c] focus:outline-none focus:ring-2 focus:ring-[#0e7655]'>
          <X className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
}

export default UnseenChatToast
