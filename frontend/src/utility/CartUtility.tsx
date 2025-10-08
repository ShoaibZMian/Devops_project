
interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
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
    const existingItem = cart.find((i) => i.productId === item.productId);
    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }
    saveCart(cart);
}

export const removeFromCart: (productId: string) => void = (productId: string) => {
    const cart = getCart();
    const updatedCart = cart.filter((i) => i.productId !== productId);
    saveCart(updatedCart);
}
