import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";

const OrderSummary = () => {
  const { currency, router, cart, getCartCount, getCartAmount, clearCart } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const fetchUserAddresses = async () => {
    setUserAddresses(addressDummyData);
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
     
      const validPromos = {
        "SAVE10": { discount: 0.1, type: "percentage" },
        "FREESHIP": { discount: 5, type: "fixed" }
      };
      
      if (validPromos[promoCode.toUpperCase()]) {
        setAppliedPromo(validPromos[promoCode.toUpperCase()]);
      } else {
        alert("Invalid promo code");
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

  const createOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsCreatingOrder(true);

    try {
      
      const orderData = {
        customer_name: selectedAddress.fullName,
        customer_email: "customer@example.com", 
        customer_phone: selectedAddress.phone || "0000000000",
        customer_address: `${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.pincode}`,
        items: cart.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        promo_code: appliedPromo ? promoCode : null
      };

      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        
      
        await clearCart();
        
       
        router.push(`/order-confirmation?order_id=${order.id}`);
      } else {
        const errorData = await response.json();
        alert(`Failed to create order: ${errorData.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

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
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg 
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 max-h-60 overflow-y-auto">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center text-josseypink1 font-medium"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

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
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
              disabled={!!appliedPromo}
            />
            <button 
              onClick={handleApplyPromo}
              disabled={!!appliedPromo}
              className="bg-josseypink2 text-white px-6 py-2.5 hover:bg-josseypink1 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {appliedPromo ? "Applied" : "Apply"}
            </button>
          </div>
          {appliedPromo && (
            <div className="mt-2 text-green-600 text-sm">
              Promo code applied! Discount: {appliedPromo.type === 'percentage' 
                ? `${appliedPromo.discount * 100}%` 
                : `${currency}${appliedPromo.discount}`}
              <button 
                onClick={() => {
                  setAppliedPromo(null);
                  setPromoCode("");
                }}
                className="ml-2 text-josseypink2 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items ({getCartCount()})</p>
            <p className="text-gray-800">{currency}{getCartAmount().toFixed(2)}</p>
          </div>
          
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{calculateTax().toFixed(2)}</p>
          </div>
          
          {appliedPromo && (
            <div className="flex justify-between text-green-600">
              <p className="text-gray-600">Discount</p>
              <p className="font-medium">-{currency}{calculateDiscount().toFixed(2)}</p>
            </div>
          )}
          
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{calculateTotal().toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button 
          onClick={createOrder}
          disabled={!selectedAddress || isCreatingOrder}
          className="w-full bg-josseypink2 text-white py-3 hover:bg-josseypink1 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isCreatingOrder ? "Placing Order..." : "Place Order"}
        </button>
        
        <button 
          onClick={handleClearCart}
          className="w-full border border-gray-300 text-gray-600 py-3 hover:bg-gray-100 transition"
        >
          Clear Cart
        </button>
      </div>

      {!selectedAddress && (
        <div className="mt-3 text-sm text-josseypink2 text-center">
          Please select a delivery address to continue
        </div>
      )}
    </div>
  );
};

export default OrderSummary;