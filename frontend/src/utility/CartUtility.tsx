import { toast } from 'react-toastify';

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    rebateQuantity?: number;
    rebatePercent?: number;
    originalPrice?: number;
}


export const getCart: () => CartItem[] = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

export const saveCart = (cart: CartItem[]): void => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export const handleQuantityChange: (productId: string, quantity: number) => void = (productId: string, quantity: number) => {
    const cart = getCart();
    const updatedCart = cart.map((i) => {
        if (i.productId === productId) {
            return {
                ...i,
                quantity,
            }
        }
        return i;
    });
    saveCart(updatedCart);
}

export const addToCart: (item: CartItem) => void = (item: CartItem) => {
    const cart = getCart();
    const existingItem = cart.find((i) => i.id === item.id || i.productId === item.productId);
    if (existingItem) {
        existingItem.quantity += item.quantity;

        // Apply rebate if quantity meets threshold
        if (existingItem.rebateQuantity && existingItem.rebatePercent && existingItem.originalPrice) {
            if (existingItem.quantity >= existingItem.rebateQuantity) {
                existingItem.price = existingItem.originalPrice * (1 - existingItem.rebatePercent / 100);
            } else {
                existingItem.price = existingItem.originalPrice;
            }
        }

        toast.success(`Updated ${item.name} quantity in cart!`, {
            position: "top-right",
            autoClose: 3000,
        });
    } else {
        cart.push(item);
        toast.success(`${item.name} added to cart!`, {
            position: "top-right",
            autoClose: 3000,
        });
    }
    saveCart(cart);
}

export const removeFromCart: (productId: string) => void = (productId: string) => {
    const cart = getCart();
    const updatedCart = cart.filter((i) => i.productId !== productId);
    saveCart(updatedCart);
}
