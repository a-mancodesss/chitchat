import { Icons } from '@/components/Icons'
import SignOutButton from '@/components/SignOutButton'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {  ReactNode } from 'react'
import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions'
import { fetchRedis } from '@/helper/redis'
import { getFriendsByUserId } from '@/helper/get-friends-by-user-id'
import SidebarChatList from '@/components/SidebarChartList'
import MobileChatLayout from '@/components/MobileChatLayout'
import { SidebarOption } from '@/types/typings'
import { User } from '@/types/db'

interface LayoutProps {
  children: ReactNode
}

export const metadata = {
  title: 'ChitChat',
  description: 'Your conversations, all in one place.',
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'UserPlus',
  },
]

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)

  const unseenRequestCount = (
    (await fetchRedis(
      'smembers',
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length

  return (
    <div className='flex h-dvh w-full overflow-hidden bg-[#f5faf6]'>
      <div className='md:hidden'>
        <MobileChatLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        />
      </div>

      <aside className='z-10 hidden h-full w-[296px] shrink-0 flex-col border-r border-[#e5eee7] bg-white px-5 py-6 md:flex'>
        <Link href='/dashboard' className='mb-8 flex shrink-0 items-center gap-3 rounded-2xl px-2 py-1'>
          <Icons.Logo className='h-3.5 w-3.5 shrink-0' />
          <span className='text-lg font-semibold tracking-[-0.04em] text-[#17271f]'>chitchat</span>
        </Link>

        {friends.length > 0 ? (
          <div className='mb-2 px-3 text-xs font-medium text-[#87958b]'>
            Messages
          </div>
        ) : null}

        <SidebarChatList sessionId={session.user.id} friends={friends} />

        <nav className='mt-8 flex flex-col'>
          <div className='mb-2 px-3 text-xs font-medium text-[#87958b]'>People</div>
          <ul role='list' className='space-y-1'>
            {sidebarOptions.map((option) => {
              const Icon = Icons[option.Icon]
              return (
                <li key={option.id}>
                  <Link href={option.href} className='group flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium text-[#5f7065] transition-colors hover:bg-[#edf7f0] hover:text-[#0e7655]'>
                    <span className='grid h-8 w-8 place-items-center rounded-full bg-[#f3f8f4] text-[#789082] transition-colors group-hover:bg-white group-hover:text-[#0e7655]'>
                      <Icon className='h-4 w-4' />
                    </span>
                    <span className='truncate'>{option.name}</span>
                  </Link>
                </li>
              )
            })}
            <li>
              <FriendRequestSidebarOptions
                sessionId={session.user.id}
                initialUnseenRequestCount={unseenRequestCount}
              />
            </li>
          </ul>
        </nav>

        <div className='mt-auto flex items-center gap-2 rounded-[1.4rem] bg-[#f5f9f5] p-2'>
          <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white'>
            <Image fill referrerPolicy='no-referrer' className='object-cover' src={session.user.image || ''} alt='Your profile picture' />
          </div>
          <div className='min-w-0 flex-1'>
            <span className='block truncate text-sm font-semibold text-[#26372c]'>{session.user.name}</span>
            <span className='block truncate text-xs text-[#849188]'>{session.user.email}</span>
          </div>
          <SignOutButton className='grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#849188] transition-colors hover:bg-white hover:text-[#a54842]' />
        </div>
      </aside>

      <main className='min-h-0 min-w-0 flex-1 overflow-y-auto px-4 pb-6 pt-[76px] sm:px-6 md:px-8 md:py-8 lg:px-12'>
        <div className='mx-auto min-h-full w-full max-w-6xl'>{children}</div>
      </main>
    </div>
  )
}

export default Layout
