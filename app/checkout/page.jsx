'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

const Checkout = () => {
  const { cart, userData, addToast, clearCart } = useAppContext()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) 
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    email: '',
    customer_name: '',
    customer_phone: '',
    address: {
      country: 'Nigeria',
      street_address: '',
      town: '',
      state: '',
      postal_code: ''
    },
    order_notes: ''
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      addToast('Your cart is empty', 'error')
      router.push('/cart')
    }
  }, [cart, router, addToast])

  // Populate form with user data if available
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        email: userData.email || '',
        customer_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        customer_phone: userData.phone_number || '',
        address: {
          country: userData.country || 'Nigeria',
          street_address: userData.street_address || '',
          town: userData.town || '',
          state: userData.state || '',
          postal_code: userData.postal_code || ''
        }
      }))
    }
  }, [userData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    if (name.includes('address.')) {
      const addressField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validateStep1 = () => {
    const errors = {}
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    // Validate name
    if (!formData.customer_name.trim()) {
      errors.customer_name = 'Full name is required'
    } else if (formData.customer_name.trim().length < 2) {
      errors.customer_name = 'Name must be at least 2 characters'
    }
    
    // Validate phone
    if (!formData.customer_phone.trim()) {
      errors.customer_phone = 'Phone number is required'
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.customer_phone.replace(/\s/g, ''))) {
      errors.customer_phone = 'Please enter a valid phone number'
    }
    
    // Validate address fields
    if (!formData.address.street_address.trim()) {
      errors['address.street_address'] = 'Street address is required'
    }
    if (!formData.address.town.trim()) {
      errors['address.town'] = 'Town/City is required'
    }
    if (!formData.address.state.trim()) {
      errors['address.state'] = 'State is required'
    }
    if (!formData.address.postal_code.trim()) {
      errors['address.postal_code'] = 'Postal code is required'
    }
    
    setFormErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      addToast('Please fix the errors in the form', 'error')
      return false
    }
    
    return true
  }

  const handleProceedToPayment = () => {
    if (validateStep1()) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePayment = async () => {
    if (!cart?.id) {
      addToast('Cart not found', 'error')
      return
    }

    setLoading(true)
    try {
      // 1. Create order
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_id: cart.id,
          ...formData
        })
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || orderData.details || 'Failed to create order')
      }

      // ✅ STORE EMAIL IN LOCALSTORAGE FOR MYORDERS PAGE
      localStorage.setItem('guestOrderEmail', formData.email)
      sessionStorage.setItem('guestOrderEmail', formData.email)
      console.log('🔍 DEBUG: Stored email for MyOrders:', formData.email)

      // 2. Initialize payment WITH order_id
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/initialize/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_id: cart.id,
          email: formData.email,
          order_id: orderData.order_id,
          callback_url: `${window.location.origin}/payment/verify`
        })
      })

      const paymentData = await paymentResponse.json()

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || paymentData.details || 'Failed to initialize payment')
      }

      // 3. Redirect to Paystack
      if (paymentData.authorization_url) {
        window.location.href = paymentData.authorization_url
      } else {
        throw new Error('No authorization URL received from payment service')
      }

    } catch (error) {
      console.error('Payment error:', error)
      addToast(error.message || 'Payment failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // If cart is empty, show proper empty state
  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart before checking out.</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/all-products')}
                className="w-full bg-josseypink2 text-white py-3 px-4 rounded-md hover:bg-josseypink1 transition-colors font-medium"
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => router.push('/cart')}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Back to Cart
              </button>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your purchase</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Progress Steps */}
              <div className="flex justify-between mb-8">
                <div className={`flex flex-col items-center ${step >= 1 ? 'text-josseypink2' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? 'bg-josseypink2 text-white' : 'bg-gray-200'
                  }`}>
                    1
                  </div>
                  <span className="text-sm mt-2">Information</span>
                </div>
                <div className={`flex flex-col items-center ${step >= 2 ? 'text-josseypink2' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? 'bg-josseypink2 text-white' : 'bg-gray-200'
                  }`}>
                    2
                  </div>
                  <span className="text-sm mt-2">Payment</span>
                </div>
              </div>

              {/* Step 1: Customer Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent ${
                          formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="your@email.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="customer_name"
                          value={formData.customer_name}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent ${
                            formErrors.customer_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="John Doe"
                        />
                        {formErrors.customer_name && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.customer_name}
                          </p>
                        )}
                      </div>

                      {/* Phone Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="customer_phone"
                          value={formData.customer_phone}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent ${
                            formErrors.customer_phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="+234 800 000 0000"
                        />
                        {formErrors.customer_phone && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.customer_phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                    
                    <div className="space-y-4">
                      {/* Street Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="address.street_address"
                          value={formData.address.street_address}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent ${
                            formErrors['address.street_address'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="123 Main Street"
                        />
                        {formErrors['address.street_address'] && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors['address.street_address']}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Town/City */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Town/City *
                          </label>
                          <input
                            type="text"
                            name="address.town"
                            value={formData.address.town}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent ${
                              formErrors['address.town'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Lagos"
                          />
                          {formErrors['address.town'] && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {formErrors['address.town']}
                            </p>
                          )}
                        </div>

                        {/* State */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent ${
                              formErrors['address.state'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Lagos State"
                          />
                          {formErrors['address.state'] && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {formErrors['address.state']}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Postal Code */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            name="address.postal_code"
                            value={formData.address.postal_code}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent ${
                              formErrors['address.postal_code'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="100001"
                          />
                          {formErrors['address.postal_code'] && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {formErrors['address.postal_code']}
                            </p>
                          )}
                        </div>

                        {/* Country */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <select
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                          >
                            <option value="Nigeria">Nigeria</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Kenya">Kenya</option>
                            <option value="South Africa">South Africa</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="order_notes"
                      value={formData.order_notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                      placeholder="Any special instructions for your order..."
                    />
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    className="w-full bg-josseypink2 text-white py-3 px-4 rounded-md hover:bg-josseypink1 transition-colors font-medium"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-josseypink2 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">P</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Paystack</h3>
                        <p className="text-gray-600">Secure payment processing</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      💡 You'll be redirected to Paystack to complete your payment securely.
                    </p>
                  </div>

                  {/* Order Review */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Review</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="text-gray-900">{formData.customer_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="text-gray-900">{formData.customer_phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="text-gray-900 text-right">
                          {formData.address.street_address}, {formData.address.town}<br />
                          {formData.address.state}, {formData.address.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
                    >
                      Back to Information
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="flex-1 bg-josseypink2 text-white py-3 px-4 rounded-md hover:bg-josseypink1 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Pay Now'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.images?.[0]?.image_url || '/placeholder-image.jpg'}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.color && `Color: ${item.color} • `}Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₦{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₦{cart.total_price || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">₦0.00</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-josseypink2">₦{cart.total_price || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout