'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import Footer from '@/components/seller/Footer'
import React, { useState, useEffect } from 'react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onToggleSidebar={toggleSidebar} isMobile={isMobile} sidebarOpen={sidebarOpen} />
      <div className='flex flex-1 relative'>
        {/* Sidebar with overlay for mobile */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transition-transform duration-300 ease-in-out
          fixed md:static z-50 h-full
        `}>
          <Sidebar onItemClick={closeSidebar} />
        </div>
        <main 
          className={`flex-1 transition-all duration-300 ${sidebarOpen && isMobile ? 'ml-0' : 'ml-0'} md:ml-0`}
          onClick={closeSidebar}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
