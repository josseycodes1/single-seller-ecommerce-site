'use client'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const PaymentFailed = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToast } = useAppContext()

  const errorMessage = searchParams.get('message') || 'Your payment could not be processed.'

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-2">{errorMessage}</p>
          <p className="text-sm text-gray-500 mb-8">Please try again or use a different payment method.</p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Common Issues</h3>
            <ul className="text-sm text-yellow-700 space-y-1 text-left">
              <li>• Insufficient funds in your account</li>
              <li>• Incorrect card details entered</li>
              <li>• Network connectivity issues</li>
              <li>• Card not authorized for online payments</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/checkout"
              className="block w-full bg-josseypink2 text-white py-3 px-4 rounded-md hover:bg-josseypink1 transition-colors font-medium text-center"
            >
              Try Payment Again
            </Link>
            <Link
              href="/cart"
              className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium text-center"
            >
              Back to Cart
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Still having trouble? <a href="/contact" className="text-josseypink2 hover:text-josseypink1">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentFailed