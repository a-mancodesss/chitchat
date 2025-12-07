import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const loading = () => {
  return (
    <div className='w-full flex flex-col gap-3 pt-8'>
      <Skeleton className='mb-8' height={60} width={300} />
      <div className="flex flex-col gap-4">
        <Skeleton height={80} borderRadius={16} count={3} />
      </div>
    </div>
  )
}

export default loading