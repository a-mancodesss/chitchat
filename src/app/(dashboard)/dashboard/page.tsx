import Link from 'next/link'
import { FC } from 'react'

const page: FC = () => {
  return (
    <main className='pt-8'>
      <Link href='/dashboard/add'>
      Add Page
      </Link>
    </main>
  )
}

export default page