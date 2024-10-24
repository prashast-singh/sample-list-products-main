import { ref, computed } from 'vue';

// Shared cart state
export const cart = ref([]);

// Add product to cart or increase quantity
export const addToCart = (product) => {
  const existingProduct = cart.value.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1; // Increase quantity if the product is already in the cart
  } else {
    cart.value.push({ ...product, quantity: 1 }); // Add new product with quantity 1
  }
};

// Computed property to calculate cart count
export const cartCount = computed(() => cart.value.reduce((count, item) => count + item.quantity, 0));

// Computed property to calculate total cart price
export const totalPrice = computed(() => 
  cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
);
