<template>
  <nav class="navbar">
    <div class="logo">Cart24</div>
    <input type="text" class="search-bar" placeholder="Search products..." />
    <div class="cart-icon" @click="toggleCartModal">
      🛒 <span class="cart-count">{{ cartCount }}</span>
    </div>
  </nav>

  <!-- Shopping Cart Modal -->
  <div v-if="showCartModal" class="cart-modal-overlay" @click.self="toggleCartModal">
    <div class="cart-modal-content">
      <!-- Heading and Close button in the same line -->
      <div class="cart-header">
        <h3>Your Cart</h3>
        <button @click="toggleCartModal" class="close-cart-button">×</button>
      </div>

      <div class="cart-items-wrapper">
        <div v-if="cart.length === 0">
          <p>Your cart is empty.</p>
        </div>
        <div v-else>
          <!-- Cart Items with Count Controls and Delete Button -->
          <div v-for="item in cart" :key="item.id" class="cart-item">
            <img :src="item.thumbnail" alt="Product thumbnail" class="cart-item-image" />
            <div class="cart-item-info">
              <p>{{ item.title }}</p>
              <p>${{ item.price.toFixed(2) }} each</p>
              <div class="cart-quantity">
                <button @click="decreaseQuantity(item)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increaseQuantity(item)">+</button>
              </div>
              <p>Total for this item: ${{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
            <!-- Delete button for each item -->
            <button @click="removeFromCart(item)" class="delete-cart-item">🗑️</button>
          </div>
          <div class="cart-total">
            <p>Total: ${{ totalPrice.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { cart, cartCount, totalPrice } from '../cartState';  // Import shared cart state
import { ref } from 'vue';

// Show/Hide cart modal
const showCartModal = ref(false);

const toggleCartModal = () => {
  showCartModal.value = !showCartModal.value;
};

// Increase product quantity
const increaseQuantity = (item) => {
  item.quantity += 1;
};

// Decrease product quantity
const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    // Optionally remove the item if the quantity goes to zero
    cart.value = cart.value.filter(cartItem => cartItem.id !== item.id);
  }
};

// Remove item from cart
const removeFromCart = (item) => {
  cart.value = cart.value.filter(cartItem => cartItem.id !== item.id);
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #2874F0; /* Green background for good contrast */
  color: white;
  width: 100vw; /* Full-width of the viewport */
  position: fixed; /* Fix navbar to the top of the page */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* Ensure navbar is above other content */
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.search-bar {
  width: 50%;
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
}

.cart-icon {
  cursor: pointer;
  font-size: 2rem; /* Keep the size for better visibility */
  position: relative;
  color: black; /* Ensure the icon has good contrast */
  margin-right: 200px; /* Move the cart icon to the right */
}


.cart-count {
  background-color: red;
  border-radius: 50%;
  color: white;
  padding: 0.2rem 0.5rem;
  position: absolute;
  top: -10px;
  right: -15px;
  font-size: 0.9rem; /* Ensure the count is readable */
}

.cart-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.cart-modal-content {
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
  max-height: 465px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}



.cart-items-wrapper {
  max-height: 450px; /* Make the cart items scrollable */
  width: auto;
  overflow-y: auto;
}

.cart-items-wrapper::-webkit-scrollbar {
  width: 8px; /* Make the scrollbar narrower */
}

.cart-items-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1; /* Background color of the scrollbar track */
}

.cart-items-wrapper::-webkit-scrollbar-thumb {
  background: #888; /* Color of the scrollbar thumb */
  border-radius: 10px; /* Rounded scrollbar */
}

.cart-items-wrapper::-webkit-scrollbar-thumb:hover {
  background: #555; /* Darker color on hover */
}

/* For Firefox */
.cart-items-wrapper {
  scrollbar-width: thin; /* Make the scrollbar thin in Firefox */
  scrollbar-color: #888 #f1f1f1; /* Scrollbar thumb and track colors */
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cart-item-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 1rem;
}

.cart-item-info {
  flex: 1;
}


.cart-quantity button {
  width: 30px;
  height: 30px;
  border: none;
  background-color: #ddd;
  cursor: pointer;
  border-radius: 50%;
  font-size: 1.2rem;
  margin: 0 5px;
}

.delete-cart-item {
  background-color: transparent;
  border: none;
  color: #f44336;
  font-size: 1.2rem;
  cursor: pointer;
  right: 10px;
  top: 0;
}

.delete-cart-item:hover {
  color: #d32f2f;
}

.cart-quantity button:hover {
  background-color: #ccc;
}

.cart-total {
  font-weight: bold;
  margin-top: 1rem;
}

.close-cart-button {
  position: absolute; /* Absolute position relative to the modal container */
  top: 10px;
  right: 10px; /* Ensure it's in the top-right corner */
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.2rem;
  z-index: 9999; /* Make sure it's above the content */
}

.close-cart-button:hover {
  background-color: #d32f2f;
}

@media (max-width: 768px) {
  .search-bar {
    width: 40%; /* Adjust the search bar width for smaller screens */
  }

  .cart-icon {
    font-size: 1.5rem; /* Reduce cart icon size for smaller screens */
  }
}

</style>
