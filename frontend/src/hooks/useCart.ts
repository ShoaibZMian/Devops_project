import { useState, useEffect, useCallback } from 'react';

// Cart item interface
export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

// Custom hook for cart management
export const useCart = () => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        // Initialize from localStorage
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    // Sync cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Get total number of items in cart
    const getItemCount = useCallback(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    // Get total price of all items in cart
    const getTotalPrice = useCallback(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);

    // Add item to cart or update quantity if it already exists
    const addToCart = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(i => i.productId === item.productId);

            if (existingItem) {
                // Update quantity of existing item
                return prevCart.map(i =>
                    i.productId === item.productId
                        ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                        : i
                );
            } else {
                // Add new item to cart
                return [...prevCart, { ...item, quantity: item.quantity || 1 }];
            }
        });
    }, []);

    // Remove item from cart
    const removeFromCart = useCallback((productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    }, []);

    // Update quantity of specific item
    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item.productId === productId
                        ? { ...item, quantity }
                        : item
                )
            );
        }
    }, [removeFromCart]);

    // Clear entire cart
    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    // Get specific item from cart
    const getItem = useCallback((productId: string) => {
        return cart.find(item => item.productId === productId);
    }, [cart]);

    return {
        cart,
        itemCount: getItemCount(),
        totalPrice: getTotalPrice(),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItem,
    };
};
