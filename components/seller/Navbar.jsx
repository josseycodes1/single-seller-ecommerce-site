'use client'
import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'
import Link from 'next/link';

const Navbar = ({ onToggleSidebar, isMobile, sidebarOpen }) => {
  const { router } = useAppContext()

  return (
    <div className='flex items-center px-4 md:px-6 py-3 justify-between border-b bg-white shadow-sm sticky top-0 z-30'>
      <div className="flex items-center gap-3 md:gap-4">
        {/* Hamburger Menu Button for Mobile - PINK with 3 dashes */}
        {isMobile && (
          <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-josseypink2 hover:bg-josseypink2/10 transition-colors"
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
        <h1 
          onClick={() => router.push('/')} 
          className='text-lg md:text-xl lg:text-2xl font-bold text-josseypink2 cursor-pointer'
        >
          JOSSEYCART
        </h1>
      </div>
      <Link href="/" target="_blank" rel="noopener noreferrer">
        <button className='bg-josseypink2 text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm font-medium hover:bg-josseypink1 transition-colors shadow-sm'>
          Home Page
        </button>
      </Link>
    </div>
  )
}

export default Navbar