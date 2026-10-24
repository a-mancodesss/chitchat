import AddFriendButton from '@/components/AddFriendButton'
import { FC } from 'react'

const page: FC = () => {
  return (
    <main className='py-2 md:py-4'>
      <header className='mb-7 sm:mb-9'>
        <h1 className='text-3xl font-semibold tracking-[-0.055em] text-[#17271f] sm:text-[2.6rem]'>Add a friend</h1>
      </header>
      <div className='max-w-xl rounded-[2rem] bg-white p-5 sm:p-7'>
        <AddFriendButton />
      </div>
    </main>
  )
}

export default page
