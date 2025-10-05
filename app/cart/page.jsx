"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import OrderSummary from "./OrderSummary";
import { formatCurrency } from "@/lib/utils";

const Cart = () => {
  const { cart, removeFromCart, updateCartItemColor } = useAppContext();
  const router = useRouter();

  // Local states
  const [localQuantities, setLocalQuantities] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");

  // Initialize local quantities when cart loads
  useEffect(() => {
    if (cart?.items) {
      const initial = {};
      cart.items.forEach((item) => {
        initial[item.id] = item.quantity;
      });
      setLocalQuantities(initial);
    }
  }, [cart]);

  // Local-only handlers
  const handleLocalIncrement = (itemId) => {
    setLocalQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1,
    }));
  };

  const handleLocalDecrement = (itemId) => {
    setLocalQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) - 1),
    }));
  };

  const handleLocalInputChange = (itemId, value) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty > 0) {
      setLocalQuantities((prev) => ({ ...prev, [itemId]: qty }));
    }
  };

  // Modal handlers for color selection
  const openModal = (itemId, currentColor) => {
    setSelectedItemId(itemId);
    setSelectedColor(currentColor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItemId(null);
    setSelectedColor("");
  };

  const handleColorSave = () => {
    if (selectedItemId && selectedColor) {
      updateCartItemColor(selectedItemId, selectedColor);
    }
    closeModal();
  };

  // Checkout
  const handleCheckout = () => {
    console.log("Send this to backend:", localQuantities);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-8">
      {/* Cart Items Section */}
      <div className="flex-1">
        {cart?.items?.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">Product</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Color</th>
                    <th className="p-2">Subtotal</th>
                    <th className="p-2">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((cartItem) => {
                    const productPrice =
                      cartItem.product.discount_price ??
                      cartItem.product.price;
                    const quantity =
                      localQuantities[cartItem.id] ?? cartItem.quantity;

                    return (
                      <tr key={cartItem.id} className="border-t">
                        <td className="p-2">
                          <Image
                            src={cartItem.product.images?.[0]?.image || assets.default_image}
                            alt={cartItem.product.name}
                            width={60}
                            height={60}
                            className="object-cover"
                          />
                        </td>
                        <td className="p-2">{cartItem.product.name}</td>
                        <td className="p-2">
                          {formatCurrency(parseFloat(productPrice))}
                        </td>
                        <td className="p-2 flex items-center gap-2">
                          <button
                            onClick={() => handleLocalDecrement(cartItem.id)}
                            className="px-2 py-1 border rounded"
                            disabled={quantity <= 1}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            min="1"
                            onChange={(e) =>
                              handleLocalInputChange(
                                cartItem.id,
                                e.target.value
                              )
                            }
                            className="w-12 border rounded text-center py-1"
                          />
                          <button
                            onClick={() => handleLocalIncrement(cartItem.id)}
                            className="px-2 py-1 border rounded"
                          >
                            +
                          </button>
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() =>
                              openModal(cartItem.id, cartItem.color)
                            }
                            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100"
                          >
                            {cartItem.color || "Select Color"}
                          </button>
                        </td>
                        <td className="p-2">
                          {formatCurrency(parseFloat(productPrice) * quantity)}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => removeFromCart(cartItem.id)}
                            className="text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {cart.items.map((cartItem) => {
                const productPrice =
                  cartItem.product.discount_price ?? cartItem.product.price;
                const quantity =
                  localQuantities[cartItem.id] ?? cartItem.quantity;

                return (
                  <div
                    key={cartItem.id}
                    className="border border-gray-300 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={cartItem.product.images?.[0]?.image || assets.default_image}
                        alt={cartItem.product.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{cartItem.product.name}</h3>
                        <p className="text-gray-600">
                          {formatCurrency(parseFloat(productPrice))}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => handleLocalDecrement(cartItem.id)}
                        className="px-2 py-1 border rounded"
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        min="1"
                        onChange={(e) =>
                          handleLocalInputChange(cartItem.id, e.target.value)
                        }
                        className="w-12 border rounded text-center py-1"
                      />
                      <button
                        onClick={() => handleLocalIncrement(cartItem.id)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() =>
                          openModal(cartItem.id, cartItem.color)
                        }
                        className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100"
                      >
                        {cartItem.color || "Select Color"}
                      </button>
                    </div>
                    <p className="mt-2 font-medium">
                      Subtotal:{" "}
                      {formatCurrency(parseFloat(productPrice) * quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(cartItem.id)}
                      className="mt-2 text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
      </div>

      {/* Order Summary */}
      {cart?.items?.length > 0 && (
        <div className="md:w-1/3">
          <OrderSummary cart={cart} />
          <button
            onClick={handleCheckout}
            className="mt-4 w-full bg-josseypink text-white py-2 px-4 rounded hover:bg-josseypink2"
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-semibold mb-4">Select a Color</h2>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="">Choose a color</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Black">Black</option>
            </select>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleColorSave}
                className="px-4 py-2 bg-josseypink text-white rounded hover:bg-josseypink2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
