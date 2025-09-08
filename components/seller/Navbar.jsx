import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'
import Link from 'next/link';

const Navbar = () => {

  const { router } = useAppContext()

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
      <h1 onClick={()=>router.push('/')} className='w-28 lg:w-32 cursor-pointer text-josseypink2'> JOSSEYCART </h1>
      <Link href="/all-products" target="_blank" rel="noopener noreferrer">
        <button className='bg-josseypink2 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>
          View Website
        </button>
      </Link>
    </div>
  )
}

export default Navbar