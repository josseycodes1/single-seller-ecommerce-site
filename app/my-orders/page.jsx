'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

// Content component
const MyOrdersContent = () => {
  const router = useRouter()
  const { addToast } = useAppContext()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Get email from localStorage or sessionStorage
    const guestEmail = localStorage.getItem('guestOrderEmail') || sessionStorage.getItem('guestOrderEmail')
    
    if (!guestEmail) {
      addToast('No order history found. Please complete a purchase first.', 'info')
      router.push('/')
      return
    }

    setEmail(guestEmail)
    fetchOrders(guestEmail)
  }, [router, addToast])

  const fetchOrders = async (userEmail) => {
    try {
      setLoading(true)
      console.log('🔍 DEBUG: Fetching orders for email:', userEmail)
      
      // Use the guest orders endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/guest/orders/?email=${encodeURIComponent(userEmail)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'omit'
        }
      )

      console.log('🔍 DEBUG: Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('🔍 DEBUG: Response error:', errorText)
        throw new Error(`Failed to fetch orders: ${response.status}`)
      }

      const ordersData = await response.json()
      console.log('🔍 DEBUG: Orders data received:', ordersData)
      setOrders(ordersData)
    } catch (error) {
      console.error('❌ Error fetching orders:', error)
      addToast('Failed to load orders. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered'
      case 'shipped':
        return 'Shipped'
      case 'processing':
        return 'Processing'
      case 'pending':
        return 'Pending'
      default:
        return status
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-josseypink2 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">
              Order history for <span className="font-semibold">{email}</span>
            </p>
          </div>

          {orders.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Found</h2>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping to see your order history here.
              </p>
              <Link
                href="/"
                className="inline-block bg-josseypink2 text-white py-3 px-6 rounded-md hover:bg-josseypink1 transition-colors font-medium"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            // Orders list
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Order header */}
                  <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(order.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          {item.product.images && item.product.images.length > 0 && (
                            <img
                              src={item.product.images[0].image_url}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            {item.color && (
                              <p className="text-sm text-gray-600">
                                Color: <span className="capitalize">{item.color}</span>
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.price)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order footer */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                          {order.address ? (
                            <p className="text-sm text-gray-600">
                              {order.address.street_address}, {order.address.town}<br />
                              {order.address.state}, {order.address.country}<br />
                              {order.address.postal_code}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">No address provided</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {order.is_paid ? 'Paid' : 'Pending Payment'}
                          </span>
                          {order.order_notes && (
                            <div className="text-sm text-gray-600">
                              <strong>Notes:</strong> {order.order_notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Support section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help with your orders?{' '}
              <Link href="/contact" className="text-josseypink2 hover:text-josseypink1 font-medium">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// Main component with Suspense boundary
const MyOrders = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-josseypink2 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <MyOrdersContent />
    </Suspense>
  )
}

export default MyOrders
