import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

const loading = () => {
  return (
    <div className='flex h-[calc(100dvh-6.5rem)] flex-col justify-between overflow-hidden rounded-[2rem] bg-white md:h-[calc(100dvh-4rem)]'>
      {/* Header */}
      <div className='sticky top-0 z-10 flex items-center justify-between border-b border-[#edf1ed] bg-white/90 px-4 py-3.5 backdrop-blur-sm sm:px-6 sm:py-4'>
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
      <div className='flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto bg-white px-3 py-5 scrollbar-thumb-emerald-200 scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-w-2 scrolling-touch sm:px-5 sm:py-6'>
        
        {/* User Message */}
        <div className='flex items-end justify-end'>
          <div className='flex flex-col space-y-2 max-w-xs mx-2 items-end'>
            <span className='inline-block rounded-[1.4rem] bg-[#e7f5eb] px-5 py-2.5'>
              <Skeleton width={140} height={20} />
            </span>
          </div>
          <Skeleton width={36} height={36} borderRadius={999} />
        </div>

        {/* Friend Message */}
        <div className='flex items-end'>
          <Skeleton width={36} height={36} borderRadius={999} />
          <div className='flex flex-col space-y-2 max-w-xs mx-2 items-start'>
            <span className='inline-block rounded-[1.4rem] bg-[#eff7f0] px-5 py-2.5'>
              <Skeleton width={180} height={20} />
            </span>
          </div>
        </div>

        {/* User Message */}
        <div className='flex items-end justify-end'>
          <div className='flex flex-col space-y-2 max-w-xs mx-2 items-end'>
            <span className='inline-block rounded-[1.4rem] bg-[#e7f5eb] px-5 py-2.5'>
              <Skeleton width={200} height={20} />
            </span>
          </div>
          <Skeleton width={36} height={36} borderRadius={999} />
        </div>

        {/* Friend Message */}
        <div className='flex items-end'>
          <Skeleton width={36} height={36} borderRadius={999} />
          <div className='flex flex-col space-y-2 max-w-xs mx-2 items-start'>
            <span className='inline-block rounded-[1.4rem] bg-[#eff7f0] px-5 py-2.5'>
               <Skeleton width={120} height={20} />
            </span>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className='border-t border-[#edf1ed] px-3 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4'>
        <div className='relative h-[50px] flex-1 overflow-hidden rounded-full bg-[#f7faf7] ring-1 ring-inset ring-[#e7eee8]'>
          <div className='py-3 px-4 w-full'>
             <Skeleton height={24} width="60%" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default loading
