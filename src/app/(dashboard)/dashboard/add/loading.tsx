import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const loading = () => {
  return (
    <div className='w-full flex flex-col gap-3 pt-8'>
      <Skeleton className='mb-8' height={60} width={250} />
      <Skeleton height={50} count={3} borderRadius={16} />
    </div>
  )
}

export default loading