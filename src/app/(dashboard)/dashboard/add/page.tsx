import AddFriendButton from '@/components/AddFriendButton'
import { FC } from 'react'

const page: FC = () => {
  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8 tracking-tight text-gray-900'>Add a friend</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-lg">
        <AddFriendButton />
      </div>
    </main>
  )
}

export default page
