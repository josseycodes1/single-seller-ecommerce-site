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
    const required = ['email', 'customer_name', 'customer_phone']
    const addressRequired = ['street_address', 'town', 'state', 'postal_code']
    
    for (let field of required) {
      if (!formData[field]?.trim()) {
        addToast(`Please fill in ${field.replace('_', ' ')}`, 'error')
        return false
      }
    }
    
    for (let field of addressRequired) {
      if (!formData.address[field]?.trim()) {
        addToast(`Please fill in ${field.replace('_', ' ')}`, 'error')
        return false
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      addToast('Please enter a valid email address', 'error')
      return false
    }
    
    return true
  }

  const handleProceedToPayment = () => {
    if (validateStep1()) {
      setStep(2)
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
        throw new Error(orderData.error || 'Failed to create order')
        }

        // 2. Initialize payment
        const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/initialize/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cart_id: cart.id,
            email: formData.email,
            callback_url: `${window.location.origin}/payment/verify`
        })
        })

        const paymentData = await paymentResponse.json()

        if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Failed to initialize payment')
        }

        // 3. Redirect to Paystack
        if (paymentData.authorization_url) {
        window.location.href = paymentData.authorization_url
        } else {
        throw new Error('No authorization URL received')
        }

    } catch (error) {
        console.error('Payment error:', error)
        addToast(error.message || 'Payment failed. Please try again.', 'error')
    } finally {
        setLoading(false)
    }
    }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <button 
              onClick={() => router.push('/all-products')}
              className="bg-josseypink2 text-white px-6 py-3 rounded-lg hover:bg-josseypink1 transition-colors"
            >
              Continue Shopping
            </button>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="customer_name"
                          value={formData.customer_name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="customer_phone"
                          value={formData.customer_phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                          placeholder="+234 800 000 0000"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="address.street_address"
                          value={formData.address.street_address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                          placeholder="123 Main Street"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Town/City *
                          </label>
                          <input
                            type="text"
                            name="address.town"
                            value={formData.address.town}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                            placeholder="Lagos"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                            placeholder="Lagos State"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            name="address.postal_code"
                            value={formData.address.postal_code}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-josseypink2 focus:border-transparent"
                            placeholder="100001"
                            required
                          />
                        </div>

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
                      {loading ? 'Processing...' : 'Pay Now'}
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