'use client'
import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'
import Link from 'next/link';

const Navbar = ({ onToggleSidebar, isMobile, sidebarOpen }) => {
  const { router } = useAppContext()

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b bg-white shadow-sm'>
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Button for Mobile */}
        {isMobile && (
          <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-josseypink2 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        )}
        <h1 onClick={()=>router.push('/')} className='w-28 lg:w-32 cursor-pointer text-josseypink2 font-bold text-xl'> JOSSEYCART </h1>
      </div>
      <Link href="/" target="_blank" rel="noopener noreferrer">
        <button className='bg-josseypink2 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg text-sm font-medium hover:bg-josseypink1 transition-colors shadow-sm'>
          Home Page
        </button>
      </Link>
    </div>
  )
}

export default Navbar