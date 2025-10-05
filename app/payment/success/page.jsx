'use client'
import React, { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'


const PaymentSuccessContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToast, clearCart } = useAppContext()

  useEffect(() => {
    const reference = searchParams.get('reference')
    const trxref = searchParams.get('trxref')
    
    if (reference || trxref) {
      addToast('Payment completed successfully!', 'success')
      

      setTimeout(() => {
        clearCart()
      }, 1000)
    }
  }, [searchParams, addToast, clearCart])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">Thank you for your purchase</p>
          <p className="text-sm text-gray-500 mb-8">Your order has been confirmed and will be processed shortly.</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You will receive an order confirmation email</li>
              <li>• We'll notify you when your order ships</li>
              <li>• Delivery typically takes 3-5 business days</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-josseypink2 text-white py-3 px-4 rounded-md hover:bg-josseypink1 transition-colors font-medium text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/contact"
              className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium text-center"
            >
              Contact Us
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? <a href="/contact" className="text-josseypink2 hover:text-josseypink1">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}


const PaymentSuccess = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-josseypink2 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}

export default PaymentSuccess