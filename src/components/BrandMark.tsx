import type { SVGProps } from 'react'

const BrandMark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 16 16'
    aria-hidden='true'
    focusable='false'
    {...props}>
    <defs>
      <linearGradient id='chitchat-dot-gradient' x1='0' y1='1' x2='1' y2='0'>
        <stop offset='0%' stopColor='#0e7655' />
        <stop offset='55%' stopColor='#16b981' />
        <stop offset='100%' stopColor='#82dfa2' />
      </linearGradient>
    </defs>
    <circle cx='8' cy='8' r='7' fill='url(#chitchat-dot-gradient)' />
  </svg>
)

export default BrandMark
