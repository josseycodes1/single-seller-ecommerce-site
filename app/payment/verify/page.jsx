'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import Navbar from '@/components/Navbar'

const PaymentVerify = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToast, clearCart } = useAppContext()
  
  const [status, setStatus] = useState('verifying') // verifying, success, failed
  const [paymentData, setPaymentData] = useState(null)

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference')
      const trxref = searchParams.get('trxref')

      if (!reference && !trxref) {
        setStatus('failed')
        addToast('No payment reference found', 'error')
        return
      }

      const paymentReference = reference || trxref

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/verify/?reference=${paymentReference}`
        )
        
        const data = await response.json()

        if (data.success && data.status === 'success') {
          setStatus('success')
          setPaymentData(data.payment_data)
          addToast('Payment successful!', 'success')
          
          // Clear cart using your existing clearCart method
          clearCart()
          
          // Optional: Redirect to success page after delay
          setTimeout(() => {
            router.push('/payment/success')
          }, 2000)
        } else {
          setStatus('failed')
          addToast(data.message || 'Payment verification failed', 'error')
          
          // Redirect to failed page after delay
          setTimeout(() => {
            router.push('/payment/failed')
          }, 2000)
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('failed')
        addToast('Payment verification failed', 'error')
        
        // Redirect to failed page after delay
        setTimeout(() => {
          router.push('/payment/failed')
        }, 2000)
      }
    }

    verifyPayment()
  }, [searchParams, addToast, clearCart, router])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-josseypink2 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
              <p className="text-gray-600 mb-6">Please wait while we confirm your payment...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-4">Redirecting you to the success page...</p>
              {paymentData && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-gray-600">
                    <strong>Reference:</strong> {paymentData.reference}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Amount:</strong> ₦{paymentData.amount}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {paymentData.email}
                  </p>
                </div>
              )}
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-josseypink2 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
              <p className="text-gray-600 mb-6">Redirecting you to the failed page...</p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-josseypink2 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default PaymentVerify