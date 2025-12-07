import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

const loading = () => {
  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
      {/* Header */}
      <div className='flex sm:items-center justify-between py-4 px-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10'>
        <div className='relative flex items-center gap-4'>
          <div className='relative'>
            <Skeleton width={48} height={48} borderRadius={999} />
          </div>

          <div className='flex flex-col leading-tight gap-1'>
            <Skeleton width={120} height={20} />
            <Skeleton width={180} height={16} />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className='flex h-full flex-1 flex-col-reverse gap-4 p-4 overflow-y-auto scrollbar-thumb-emerald-200 scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-w-2 scrolling-touch'>
        
        {/* User Message */}
        <div className='flex items-end justify-end'>
          <div className='flex flex-col space-y-2 max-w-xs mx-2 items-end'>
            <span className='px-5 py-2.5 rounded-3xl inline-block bg-emerald-600/10'>
              <Skeleton width={140} height={20} />
            </span>
          </div>
          <Skeleton width={36} height={36} borderRadius={999} />
        </div>

        {/* Friend Message */}
        <div className='flex items-end'>
          <Skeleton width={36} height={36} borderRadius={999} />
          <div className='flex flex-col space-y-2 max-w-xs mx-2 items-start'>
            <span className='px-5 py-2.5 rounded-3xl inline-block bg-gray-100'>
              <Skeleton width={180} height={20} />
            </span>
          </div>
        </div>

        {/* User Message */}
        <div className='flex items-end justify-end'>
          <div className='flex flex-col space-y-2 max-w-xs mx-2 items-end'>
            <span className='px-5 py-2.5 rounded-3xl inline-block bg-emerald-600/10'>
              <Skeleton width={200} height={20} />
            </span>
          </div>
          <Skeleton width={36} height={36} borderRadius={999} />
        </div>

        {/* Friend Message */}
        <div className='flex items-end'>
          <Skeleton width={36} height={36} borderRadius={999} />
          <div className='flex flex-col space-y-2 max-w-xs mx-2 items-start'>
            <span className='px-5 py-2.5 rounded-3xl inline-block bg-gray-100'>
               <Skeleton width={120} height={20} />
            </span>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className='border-t border-gray-100 px-4 pt-4 mb-2 sm:mb-0 pb-4'>
        <div className='relative flex-1 overflow-hidden rounded-2xl shadow-sm ring-1 ring-inset ring-gray-200 bg-gray-50 h-[50px]'>
          <div className='py-3 px-4 w-full'>
             <Skeleton height={24} width="60%" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default loading
