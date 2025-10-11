'use client'
import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const SideBar = ({ onItemClick }) => {
    const pathname = usePathname()
    const menuItems = [
        { name: 'Add Product', path: '/sellerdashboard', icon: assets.add_icon },
        { name: 'Product List', path: '/sellerdashboard/product-list', icon: assets.product_list_icon },
        { name: 'Orders', path: '/sellerdashboard/orders', icon: assets.order_icon },
    ];

    const handleItemClick = () => {
        if (onItemClick) {
            onItemClick();
        }
    };

    return (
        <div className='md:w-64 w-64 bg-white border-r min-h-screen text-base border-gray-300 py-2 flex flex-col shadow-lg md:shadow-none'>
            <div className="px-4 py-4 border-b border-gray-200 md:hidden">
                <h2 className="text-lg font-semibold text-gray-800">Seller Menu</h2>
            </div>
            {menuItems.map((item) => {
                const isActive = pathname === item.path;

                return (
                    <Link href={item.path} key={item.name} passHref>
                        <div
                            onClick={handleItemClick}
                            className={
                                `flex items-center py-3 px-4 gap-3 cursor-pointer transition-colors ${isActive
                                    ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-josseypink2 text-josseypink2 font-semibold"
                                    : "hover:bg-gray-100/90 border-white text-gray-700 hover:text-josseypink2"
                                }`
                            }
                        >
                            <Image
                                src={item.icon}
                                alt={`${item.name.toLowerCase()}_icon`}
                                className="w-6 h-6 md:w-7 md:h-7"
                            />
                            <p className='text-center text-sm md:text-base'>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;
