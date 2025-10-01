'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";

const Cart = () => {
  const {
    products,
    router,
    cart,
    updateCartQuantity,
    removeFromCart,
    getCartCount,
    setCart,
    addToast,
  } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [colorModal, setColorModal] = useState({
    open: false,
    cartItem: null,
    product: null,
    selectedColor: null,
    saving: false,
  });
  const [updatingItems, setUpdatingItems] = useState(new Set()); // Track items being updated

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!cart) setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [cart]);

  useEffect(() => {
    if (cart !== null) setLoading(false);
  }, [cart]);

  // SIMPLE QUANTITY HANDLER - One API call per click
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (updatingItems.has(itemId)) return; // Prevent multiple clicks
    
    const qty = Number(newQuantity);
    if (Number.isNaN(qty) || qty < 0) return;

    // Add to updating set
    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      if (qty === 0) {
        // Remove item
        await removeFromCart(itemId);
        addToast?.("Item removed from cart", "success");
      } else {
        // Update quantity - ONE API CALL
        const result = await updateCartQuantity(itemId, qty);
        if (result.success) {
          // UI will update automatically via context
        } else {
          addToast?.("Failed to update quantity", "error");
        }
      }
    } catch (error) {
      console.error("Quantity update error:", error);
      addToast?.("Network error. Please try again.", "error");
    } finally {
      // Remove from updating set
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Simple increment
  const handleIncrement = (cartItem) => {
    const newQuantity = cartItem.quantity + 1;
    handleQuantityChange(cartItem.id, newQuantity);
  };

  // Simple decrement
  const handleDecrement = (cartItem) => {
    const newQuantity = Math.max(1, cartItem.quantity - 1);
    handleQuantityChange(cartItem.id, newQuantity);
  };

  // Direct input change
  const handleInputChange = async (cartItem, value) => {
    if (value === "" || value === "0") return; // Allow typing
    
    const qty = parseInt(value);
    if (isNaN(qty) || qty < 1) return;
    
    if (qty !== cartItem.quantity) {
      await handleQuantityChange(cartItem.id, qty);
    }
  };

  const openColorModal = (cartItem) => {
    const product = products?.find((p) => p.id === cartItem.product.id) || null;
    const defaultColor = cartItem.color || product?.colors?.[0] || null;

    setColorModal({
      open: true,
      cartItem,
      product,
      selectedColor: defaultColor,
      saving: false,
    });
  };

  const confirmColorChange = async () => {
    const { cartItem, selectedColor } = colorModal;
    if (!cartItem || !cart) return;

    setColorModal(m => ({ ...m, saving: true }));
    try {
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
      const url = `${base}/api/cart/items/${cartItem.id}/`;

      const body = {
        cart_id: cart.id,
        quantity: cartItem.quantity,
        color: selectedColor,
      };

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        addToast?.(err?.detail || "Failed to update color", "error");
        return;
      }

      const updatedCart = await res.json();
      setCart(updatedCart);
      addToast?.("Color updated successfully", "success");
      setColorModal({ open: false, cartItem: null, product: null, selectedColor: null, saving: false });

    } catch (err) {
      console.error("Error updating color:", err);
      addToast?.("Network error while updating color", "error");
    } finally {
      setColorModal(m => ({ ...m, saving: false }));
    }
  };

  const closeColorModal = () => {
    setColorModal({ open: false, cartItem: null, product: null, selectedColor: null, saving: false });
  };

  if (loading && !cart) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Loading cart...</p>
          </div>
        </div>
      </>
    );
  }

  const displayCart = cart || { items: [], total_price: 0, total_quantity: 0 };

  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-4">
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700">
              Your <span className="font-semibold text-josseypink2">Cart</span>
            </p>
            <p className="text-base sm:text-lg text-gray-600">{getCartCount()} Items</p>
          </div>

          {displayCart.items && displayCart.items.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="text-left bg-gray-50">
                    <tr>
                      <th className="py-4 px-4 text-gray-600 font-semibold">Product Details</th>
                      <th className="py-4 px-4 text-gray-600 font-semibold">Price</th>
                      <th className="py-4 px-4 text-gray-600 font-semibold">Color</th>
                      <th className="py-4 px-4 text-gray-600 font-semibold">Quantity</th>
                      <th className="py-4 px-4 text-gray-600 font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayCart.items.map((cartItem) => {
                      const product = products?.find(p => p.id === cartItem.product.id);
                      const productName = product?.name || cartItem.product?.name || "Product";
                      const productPrice = product?.price ?? cartItem.product?.price ?? 0;
                      const productImage = product?.images?.[0]?.image_url || product?.image || '/placeholder-image.jpg';
                      const isUpdating = updatingItems.has(cartItem.id);

                      return (
                        <tr key={cartItem.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-6 px-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-lg overflow-hidden bg-gray-100 p-2 flex-shrink-0">
                                <Image
                                  src={productImage}
                                  alt={productName}
                                  className="w-16 h-16 object-cover"
                                  width={64}
                                  height={64}
                                />
                              </div>
                              <div>
                                <p className="text-gray-800 font-medium">{productName}</p>
                                <button
                                  className="text-sm text-josseypink2 hover:text-josseypink1 mt-1 transition-colors disabled:opacity-50"
                                  onClick={() => handleQuantityChange(cartItem.id, 0)}
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? "Removing..." : "Remove"}
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="py-6 px-4 text-gray-700 font-medium">
                            ${parseFloat(productPrice).toFixed(2)}
                          </td>

                          <td className="py-6 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                {cartItem.color || "Not set"}
                              </span>
                              <button
                                onClick={() => openColorModal(cartItem)}
                                className="text-xs px-3 py-1 border border-josseypink2 text-josseypink2 rounded-full hover:bg-josseypink1 hover:text-white transition-colors disabled:opacity-50"
                                disabled={isUpdating}
                              >
                                Change
                              </button>
                            </div>
                          </td>

                          <td className="py-6 px-4">
                            <div className="flex items-center gap-2 max-w-[140px]">
                              <button
                                onClick={() => handleDecrement(cartItem)}
                                disabled={isUpdating || cartItem.quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <span className="text-gray-600 font-bold">−</span>
                              </button>

                              <input
                                type="number"
                                value={cartItem.quantity}
                                min="1"
                                onChange={(e) => handleInputChange(cartItem, e.target.value)}
                                onBlur={(e) => handleInputChange(cartItem, e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleInputChange(cartItem, e.target.value)}
                                className="w-12 border border-gray-300 rounded text-center py-1 focus:outline-none focus:border-josseypink2 disabled:opacity-50"
                                disabled={isUpdating}
                              />

                              <button
                                onClick={() => handleIncrement(cartItem)}
                                disabled={isUpdating}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <span className="text-gray-600 font-bold">+</span>
                              </button>
                            </div>
                          </td>

                          <td className="py-6 px-4 text-gray-700 font-medium">
                            ${(parseFloat(productPrice) * cartItem.quantity).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {displayCart.items.map((cartItem) => {
                  const product = products?.find(p => p.id === cartItem.product.id);
                  const productName = product?.name || cartItem.product?.name || "Product";
                  const productPrice = product?.price ?? cartItem.product?.price ?? 0;
                  const productImage = product?.images?.[0]?.image_url || product?.image || '/placeholder-image.jpg';
                  const isUpdating = updatingItems.has(cartItem.id);

                  return (
                    <div key={cartItem.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="rounded-lg overflow-hidden bg-gray-100 p-2">
                            <Image
                              src={productImage}
                              alt={productName}
                              className="w-16 h-16 object-cover"
                              width={64}
                              height={64}
                            />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-gray-800 font-medium truncate">{productName}</h3>
                            <button
                              onClick={() => handleQuantityChange(cartItem.id, 0)}
                              className="text-josseypink2 hover:text-josseypink1 text-sm transition-colors disabled:opacity-50"
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Removing..." : "Remove"}
                            </button>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Price:</span>
                              <span className="text-gray-800 font-medium">${parseFloat(productPrice).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Color:</span>
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                  {cartItem.color || "Not set"}
                                </span>
                                <button
                                  onClick={() => openColorModal(cartItem)}
                                  className="text-xs px-2 py-1 border border-josseypink1 text-josseypink2 rounded hover:bg-josseypink1 hover:text-white transition-colors disabled:opacity-50"
                                  disabled={isUpdating}
                                >
                                  Change
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Quantity:</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDecrement(cartItem)}
                                  disabled={isUpdating || cartItem.quantity <= 1}
                                  className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-xs"
                                >
                                  −
                                </button>

                                <input
                                  type="number"
                                  value={cartItem.quantity}
                                  min="1"
                                  onChange={(e) => handleInputChange(cartItem, e.target.value)}
                                  onBlur={(e) => handleInputChange(cartItem, e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && handleInputChange(cartItem, e.target.value)}
                                  className="w-10 border border-gray-300 rounded text-center py-1 text-xs focus:outline-none focus:border-josseypink2 disabled:opacity-50"
                                  disabled={isUpdating}
                                />

                                <button
                                  onClick={() => handleIncrement(cartItem)}
                                  disabled={isUpdating}
                                  className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="text-gray-800">${(parseFloat(productPrice) * cartItem.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              <button
                onClick={() => router.push('/all-products')}
                className="bg-josseypink2 text-white px-6 py-3 rounded-lg hover:bg-josseypink1 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}

          <button 
            onClick={() => router.push('/all-products')} 
            className="group flex items-center mt-8 gap-2 text-josseypink2 hover:text-josseypink1 transition-colors"
          >
            <Image 
              className="group-hover:-translate-x-1 transition-transform" 
              src={assets.arrow_right_icon_colored} 
              alt="arrow_right_icon_colored" 
              width={20}
              height={20}
            />
            Continue Shopping
          </button>
        </div>

        {displayCart.items && displayCart.items.length > 0 && (
          <div className="lg:w-96">
            <OrderSummary />
          </div>
        )}
      </div>

      {/* Color Modal */}
      {colorModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeColorModal} />

          <div className="relative bg-white rounded-lg p-6 w-full max-w-md z-60 shadow-xl">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Choose Color</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a color for <strong>{colorModal.product?.name || colorModal.cartItem?.product?.name}</strong>
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {(colorModal.product?.colors && colorModal.product.colors.length > 0)
                ? colorModal.product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorModal(m => ({ ...m, selectedColor: c }))}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      colorModal.selectedColor === c 
                        ? 'bg-josseypink2 text-white border-josseypink1' 
                        : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {c}
                  </button>
                ))
                : (
                  <div className="text-sm text-gray-500 w-full text-center py-2">
                    No color options available for this product.
                  </div>
                )
              }
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={closeColorModal} 
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmColorChange}
                disabled={colorModal.saving || !colorModal.selectedColor}
                className="px-4 py-2 rounded bg-josseypink2 text-white hover:bg-josseypink1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {colorModal.saving ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;