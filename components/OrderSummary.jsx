import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import { formatPrice, formatPriceWithoutSymbol } from "@/utils/priceFormatter";

const OrderSummary = () => {
  const { currency, router, cart, getCartCount, getCartAmount, clearCart, addToast } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showAddressError, setShowAddressError] = useState(false);


  const TAX_RATE = 0.02;
  const subtotal = cart.total_price || 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const fetchUserAddresses = async () => {
    setUserAddresses(addressDummyData);
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
    setShowAddressError(false);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      {appliedPromo.type === 'percentage' 
        ? ` ${appliedPromo.discount * 100}% discount`
        : ` ${formatPrice(appliedPromo.discount)} off`  // Changed this line
      }

      
      if (validPromos[promoCode.toUpperCase()]) {
        setAppliedPromo(validPromos[promoCode.toUpperCase()]);
        addToast('Promo code applied successfully!', 'success');
      } else {
        addToast('Invalid promo code', 'error');
      }
    }
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    if (appliedPromo.type === "percentage") {
      return getCartAmount() * appliedPromo.discount;
    } else {
      return appliedPromo.discount;
    }
  };

  const calculateTax = () => {
    return getCartAmount() * 0.02; 
  };

  const calculateTotal = () => {
    const subtotal = getCartAmount();
    const tax = calculateTax();
    const discount = calculateDiscount();
    return subtotal + tax - discount;
  };

  const handleProceedToCheckout = () => {
    if (!selectedAddress) {
      
      setShowAddressError(true);
      addToast('Please select a delivery address to continue', 'error');
      
      
      const addressElement = document.getElementById('address-section');
      if (addressElement) {
        addressElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }

   
    if (selectedAddress) {
      localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
    }

   
    if (appliedPromo) {
      localStorage.setItem('appliedPromo', JSON.stringify({
        code: promoCode,
        ...appliedPromo
      }));
    }

   
    router.push('/checkout');
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
      const result = await clearCart();
      if (result.success) {
        addToast('Cart cleared successfully', 'success');
      } else {
        addToast('Failed to clear cart', 'error');
      }
    }
  };

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.address-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5 sticky top-24">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      
      <div className="space-y-6">
        {/* Address */}
        <div id="address-section" className="address-dropdown-container">
          <div className="flex items-center justify-between mb-2">
            <label className="text-base font-medium uppercase text-gray-600">
              Delivery Address
            </label>
            <span className="text-red-500 text-sm">* Required</span>
          </div>
          
          <div className="relative inline-block w-full text-sm">
            <button
              className={`peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none border ${
                showAddressError && !selectedAddress 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              } transition-colors`}
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setShowAddressError(false);
              }}
            >
              <span className={showAddressError && !selectedAddress ? 'text-red-700' : ''}>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Delivery Address"}
              </span>
              <svg 
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                } ${showAddressError && !selectedAddress ? 'text-red-500' : 'text-gray-500'}`}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Error Message */}
            {showAddressError && !selectedAddress && (
              <div className="mt-1 flex items-center text-red-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Please select a delivery address
              </div>
            )}

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border border-gray-300 shadow-lg mt-1 z-20 py-1.5 max-h-60 overflow-y-auto rounded-md">
                {userAddresses.length > 0 ? (
                  userAddresses.map((address, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 hover:bg-josseypink2/10 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => handleAddressSelect(address)}
                    >
                      <div className="font-medium text-gray-900">{address.fullName}</div>
                      <div className="text-sm text-gray-600">
                        {address.area}, {address.city}, {address.state}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{address.pincode}</div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-gray-500 text-center">
                    No addresses found
                  </li>
                )}
                <li
                  onClick={() => {
                    router.push("/add-address");
                    setIsDropdownOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-josseypink2/10 cursor-pointer text-center text-josseypink2 font-medium border-t border-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Address
                  </div>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Promo Code Section */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className={`flex-grow w-full outline-none p-2.5 text-gray-600 border ${
                appliedPromo ? 'border-green-500 bg-green-50' : 'border-gray-300'
              } transition-colors`}
              disabled={!!appliedPromo}
            />
            <button 
              onClick={handleApplyPromo}
              disabled={!!appliedPromo || !promoCode.trim()}
              className={`px-6 py-2.5 whitespace-nowrap transition-colors ${
                appliedPromo
                  ? 'bg-green-500 text-white cursor-default'
                  : promoCode.trim()
                  ? 'bg-josseypink2 text-white hover:bg-josseypink1'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {appliedPromo ? "✓ Applied" : "Apply"}
            </button>
          </div>
          {appliedPromo && (
            <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
              <div className="text-green-700 text-sm">
                <span className="font-medium">Promo applied!</span> 
                {appliedPromo.type === 'percentage' 
                  ? ` ${appliedPromo.discount * 100}% discount`
                  : ` ${currency}${appliedPromo.discount} off`
                }
              </div>
              <button 
                onClick={() => {
                  setAppliedPromo(null);
                  setPromoCode("");
                  addToast('Promo code removed', 'info');
                }}
                className="text-green-700 hover:text-green-800 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <hr className="border-gray-500/30 my-5" />

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items ({getCartCount()})</p>
            <p className="text-gray-800">{formatPrice(getCartAmount())}</p>
          </div>
          
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{formatPrice(calculateTax())}</p>
          </div>
          
          {appliedPromo && (
            <div className="flex justify-between text-green-600">
              <p className="text-gray-600">Discount</p>
              <p className="font-medium">-{formatPrice(calculateDiscount())}</p>
            </div>
          )}
          
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p className="text-josseypink2">{formatPrice(calculateTotal())}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <button 
          onClick={handleProceedToCheckout}
          className="w-full bg-josseypink2 text-white py-3 hover:bg-josseypink1 transition-colors font-medium text-lg relative group"
        >
          <span className="flex items-center justify-center rounded">
            Proceed to Checkout
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
        
        <button 
          onClick={handleClearCart}
          className="w-full border border-gray-300 rounded text-gray-600 py-3 hover:bg-gray-100 hover:border-gray-400 transition-colors font-medium"
        >
          Clear Cart
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Secure checkout with Paystack
        </p>
        {!selectedAddress && (
          <p className="text-sm text-josseypink2 mt-2 flex items-center justify-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Select a delivery address to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;