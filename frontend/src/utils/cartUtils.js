export const getCartKey = (user) => {
    if (user && user._id) {
        return `cart_${user._id}`;
    }
    return 'guest_cart';
};
