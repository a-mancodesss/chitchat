'use client'

import { Transition, Dialog, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC, Fragment, useEffect, useState } from 'react'
import { Icons } from './Icons'
import SignOutButton from './SignOutButton'
import Button, { buttonVariants } from '@/components/Button'
import FriendRequestSidebarOptions from './FriendRequestSidebarOptions'
import SidebarChatList from './SidebarChartList'
import { Session } from 'next-auth'
import { SidebarOption } from '@/types/typings'
import { usePathname } from 'next/navigation'
import { User} from '@/types/db'
import BrandMark from './BrandMark'

interface MobileChatLayoutProps {
  friends: User[]
  session: Session
  sidebarOptions: SidebarOption[]
  unseenRequestCount: number
}

const MobileChatLayout: FC<MobileChatLayoutProps> = ({ friends, session, sidebarOptions, unseenRequestCount }) => {
  const [open, setOpen] = useState<boolean>(false)

  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className='fixed inset-x-3 top-3 z-50 rounded-full border border-[#e6eee8] bg-white px-3 py-2 shadow-[0_8px_30px_-18px_rgba(28,62,42,0.3)]'>
      <div className='w-full flex justify-between items-center'>
        <Link
          href='/dashboard'
          className={`${buttonVariants({ variant: 'ghost' })} gap-2 rounded-full px-2 text-[#17271f]`}>
          <BrandMark className='h-3.5 w-3.5 shrink-0' />
          <span className='text-sm font-semibold tracking-[-0.04em]'>chitchat</span>
        </Link>
        <Button onClick={() => setOpen(true)} className='gap-2 rounded-full border-none bg-[#0e7655] px-4 text-white shadow-none hover:bg-[#0b6549] active:ring-0'>
          Menu <Menu className='h-4 w-4' />
        </Button>
      </div>
      <Transition show={open} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={setOpen}>
          <div className='fixed inset-0 bg-black/20 backdrop-blur-sm' />

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10'>
                <TransitionChild
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-700'
                  enterFrom='-translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-700'
                  leaveFrom='translate-x-0'
                  leaveTo='-translate-x-full'>
                  <DialogPanel className='pointer-events-auto w-screen max-w-md'>
                    <div className='flex h-full flex-col overflow-hidden rounded-r-[2rem] bg-[#f7faf5] py-6 shadow-xl'>
                      <div className='px-4 sm:px-6'>
                        <div className='flex items-start justify-between'>
                          <DialogTitle className='text-base font-semibold leading-6 text-[#17271f]'>
                            Your space
                          </DialogTitle>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='grid h-9 w-9 place-items-center rounded-full bg-white text-[#7c8c81] transition-colors hover:text-[#17271f] focus:outline-none focus:ring-2 focus:ring-[#0e7655] focus:ring-offset-2'
                              onClick={() => setOpen(false)}>
                              <span className='sr-only'>Close panel</span>
                              <X className='h-6 w-6' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='relative mt-6 flex flex-1 flex-col px-4 sm:px-6'>
                        {/* Content */}

                        {friends.length > 0 ? (
                          <div className='mb-2 px-3 text-xs font-medium text-[#87958b]'>
                            Messages
                          </div>
                        ) : null}

                        <nav className='flex flex-1 flex-col'>
                          <ul
                            role='list'
                            className='flex flex-1 flex-col gap-y-7'>
                            <li>
                              <SidebarChatList
                                friends={friends}
                                sessionId={session.user.id}
                              />
                            </li>

                            <li>
                              <div className='mb-2 px-3 text-xs font-medium text-[#87958b]'>
                                People
                              </div>
                              <ul role='list' className='space-y-1'>
                                {sidebarOptions.map((option) => {
                                  const Icon = Icons[option.Icon]
                                  return (
                                    <li key={option.name}>
                                      <Link
                                        href={option.href}
                                        className='text-[#5f7065] hover:text-[#0e7655] hover:bg-[#edf7f0] group flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors'>
                                        <span className='text-[#789082] group-hover:text-[#0e7655] grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f3f8f4] transition-colors group-hover:bg-white'>
                                          <Icon className='h-4 w-4' />
                                        </span>
                                        <span className='truncate'>
                                          {option.name}
                                        </span>
                                      </Link>
                                    </li>
                                  )
                                })}

                                <li>
                                  <FriendRequestSidebarOptions
                                    initialUnseenRequestCount={
                                      unseenRequestCount
                                    }
                                    sessionId={session.user.id}
                                  />
                                </li>
                              </ul>
                            </li>

                            <li className='mt-auto flex items-center gap-2 rounded-[1.4rem] bg-white p-2'>
                              <div className='flex min-w-0 flex-1 items-center gap-x-3 text-sm font-semibold leading-6 text-[#26372c]'>
                                <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#f3f8f4]'>
                                  <Image
                                    fill
                                    referrerPolicy='no-referrer'
                                    className='rounded-full object-cover'
                                    src={session.user.image || ''}
                                    alt='Your profile picture'
                                  />
                                </div>

                                <span className='sr-only'>Your profile</span>
                                <div className='flex flex-col'>
                                  <span className='truncate' aria-hidden='true'>
                                    {session.user.name}
                                  </span>
                                  <span
                                    className='truncate text-xs text-[#849188]'
                                    aria-hidden='true'>
                                    {session.user.email}
                                  </span>
                                </div>
                              </div>

                              <SignOutButton className='grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#849188] transition-colors hover:bg-[#f7eeee] hover:text-[#a54842]' />
                            </li>
                          </ul>
                        </nav>

                        {/* content end */}
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default MobileChatLayout
