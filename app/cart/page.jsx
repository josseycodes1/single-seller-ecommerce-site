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
    addToCart,
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


  const [qtyLoadingMap, setQtyLoadingMap] = useState({});

  useEffect(() => {
  
    const timer = setTimeout(() => {
      if (!cart) setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [cart]);

  useEffect(() => {
    if (cart !== null) setLoading(false);
  }, [cart]);

  
  const handleUpdateQuantity = async (itemId, newQuantity) => {

    const qty = Number(newQuantity);
    if (Number.isNaN(qty)) return;

  
    if (qty === 0) {
      setQtyLoadingMap(m => ({ ...m, [itemId]: true }));
      await removeFromCart(itemId);
      setQtyLoadingMap(m => ({ ...m, [itemId]: false }));
      return;
    }

   
    setQtyLoadingMap(m => ({ ...m, [itemId]: true }));
    const res = await updateCartQuantity(itemId, qty);
   
    setQtyLoadingMap(m => ({ ...m, [itemId]: false }));

    if (!res || !res.success) {
      addToast?.("Failed to update quantity", "error");
    }
  };


  const handleIncrease = (cartItem) => {
    handleUpdateQuantity(cartItem.id, cartItem.quantity + 1);
  };

 
  const handleDecrease = (cartItem) => {
    handleUpdateQuantity(cartItem.id, Math.max(0, cartItem.quantity - 1));
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
        setColorModal(m => ({ ...m, saving: false }));
        return;
        }

     
        await fetchCart();  
        addToast?.("Color updated", "success");
        setColorModal({ open: false, cartItem: null, product: null, selectedColor: null, saving: false });

    } catch (err) {
        console.error("Error updating color:", err);
        addToast?.("Network error while updating color", "error");
        setColorModal(m => ({ ...m, saving: false }));
    }
    };



  const closeColorModal = () => {
    setColorModal({ open: false, cartItem: null, product: null, selectedColor: null, saving: false });
  };

 
  const handleAddToCart = async (productId) => {
   
    const product = products?.find((p) => p.id === productId) || null;
    const defaultColor = product?.colors?.[0] || "default";
    await addToCart(productId, 1, defaultColor);
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
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-josseypink1">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} Items</p>
          </div>

          {displayCart.items && displayCart.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="text-left">
                  <tr>
                    <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">Product Details</th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Price</th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Color</th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Quantity</th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {displayCart.items.map((cartItem) => {
                    
                    const product = products?.find(p => p.id === cartItem.product.id);

                   
                    const productName = product?.name || cartItem.product?.name || "Product";
                    const productPrice = product?.price ?? cartItem.product?.price ?? 0;
                    const productImage = product?.images?.[0]?.image_url || product?.image || '/placeholder-image.jpg';

                    return (
                      <tr key={cartItem.id} className="align-top">
                        <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                          <div>
                            <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                              <Image
                                src={productImage}
                                alt={productName}
                                className="w-16 h-auto object-cover mix-blend-multiply"
                                width={64}
                                height={64}
                              />
                            </div>
                            <button
                              className="md:hidden text-xs text-josseypink1 mt-1"
                              onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(cartItem.id, 0); }}
                            >
                              Remove
                            </button>
                          </div>
                          <div className="text-sm hidden md:block">
                            <p className="text-gray-800">{productName}</p>
                            <button
                              className="text-xs text-josseypink1 mt-1"
                              onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(cartItem.id, 0); }}
                            >
                              Remove
                            </button>
                          </div>
                        </td>

                        <td className="py-4 md:px-4 px-1 text-gray-600">${parseFloat(productPrice).toFixed(2)}</td>

                        {/* Color column */}
                        <td className="py-4 md:px-4 px-1 text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {cartItem.color || "Not set"}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); openColorModal(cartItem); }}
                              className="text-xs ml-2 px-2 py-1 border rounded text-josseypink1"
                            >
                              Change
                            </button>
                          </div>
                        </td>

                        {/* Quantity column */}
                            <td className="py-4 md:px-4 px-1">
                            <div className="flex items-center md:gap-2 gap-1">
                                <button
                                onClick={(e) => { e.stopPropagation(); handleDecrease(cartItem); }}
                                disabled={qtyLoadingMap[cartItem.id]}
                                >
                                <Image src={assets.decrease_arrow} alt="decrease_arrow" className="w-4 h-4" />
                                </button>

                                <input
                                type="number"
                                value={cartItem.quantity}
                                min="1"
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    if (Number.isNaN(v) || v < 1) return;
                                    handleUpdateQuantity(cartItem.id, v);
                                }}
                                className="w-12 border text-center appearance-none"
                                />

                                <button
                                onClick={(e) => { e.stopPropagation(); handleIncrease(cartItem); }}
                                disabled={qtyLoadingMap[cartItem.id]}
                                >
                                <Image src={assets.increase_arrow} alt="increase_arrow" className="w-4 h-4" />
                                </button>

                                {qtyLoadingMap[cartItem.id] && (
                                <span className="text-xs text-gray-500 ml-2">Updating...</span>
                                )}
                            </div>
                            </td>


                        <td className="py-4 md:px-4 px-1 text-gray-600">
                          ${(parseFloat(productPrice) * cartItem.quantity).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              <button
                onClick={() => router.push('/all-products')}
                className="bg-josseypink1 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
              >
                Start Shopping
              </button>
            </div>
          )}

          <button onClick={() => router.push('/all-products')} className="group flex items-center mt-6 gap-2 text-josseypink1">
            <Image className="group-hover:-translate-x-1 transition" src={assets.arrow_right_icon_colored} alt="arrow_right_icon_colored" />
            Continue Shopping
          </button>
        </div>

        {displayCart.items && displayCart.items.length > 0 && (
          <OrderSummary />
        )}
      </div>

      {/* Color modal */}
      {colorModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeColorModal} />

          <div className="relative bg-white rounded-lg p-6 w-full max-w-md z-60">
            <h3 className="text-lg font-medium mb-3">Choose Color</h3>
            <p className="text-sm text-gray-600 mb-4">Please confirm if this is the color you want for <strong>{colorModal.product?.name || colorModal.cartItem?.product?.name}</strong>.</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {(colorModal.product?.colors && colorModal.product.colors.length > 0)
                ? colorModal.product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorModal(m => ({ ...m, selectedColor: c }))}
                    className={`px-3 py-1 rounded-full border ${colorModal.selectedColor === c ? 'bg-josseypink2 text-white' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {c}
                  </button>
                ))
                : (
                  <div className="text-sm text-gray-500">No color options available for this product.</div>
                )
              }
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={closeColorModal} className="px-4 py-2 rounded border">Cancel</button>
              <button
                onClick={confirmColorChange}
                disabled={colorModal.saving || !colorModal.selectedColor}
                className="px-4 py-2 rounded bg-josseypink2 text-white"
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