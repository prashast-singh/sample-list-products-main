<template>
  <div>
    <!-- Sorting Buttons -->
    <div class="sorting-buttons">
      <button @click="sortByPrice">
        Sort by Price {{ priceSortDirection === 'asc' ? '↑' : '↓' }}
      </button>
      <button @click="sortByTitle">
        Sort by Name {{ titleSortDirection === 'asc' ? '↑' : '↓' }}
      </button>
      <button @click="sortByRating">
        Sort by Rating {{ ratingSortDirection === 'asc' ? '↑' : '↓' }}
      </button>
    </div>

    <!-- Product Grid -->
    <div class="product-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        :style="{ backgroundColor: getCategoryColor(product.category) }"
        class="product-card"
        @click="openProductModal(product)"
      >
        <img :src="product.thumbnail" alt="product thumbnail" class="product-thumbnail" />
        <div class="product-info">
          <h3>{{ product.title }}</h3>
          <p><strong>Category:</strong> {{ product.category }}</p>
          <p><strong>Price:</strong> ${{ product.price.toFixed(2) }}</p>
          <p><strong>Rating:</strong> {{ product.rating }}</p>
          <div class="rating-bar-container">
            <div class="rating-bar" :style="{ width: (product.rating / 5) * 100 + '%' }"></div>
          </div>
          <button class="delete-button" @click.stop="deleteProduct(product.id)">Delete</button>
          <button class="add-to-cart-button" @click.stop="addToCart(product)">Add to Cart</button>
        </div>
      </div>
      <!-- Message when no products are available -->
      <div v-if="filteredProducts.length === 0">
        <p>No products available.</p>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close-btn" @click="closeModal">×</button>
        <img :src="selectedProduct.thumbnail" alt="product thumbnail" class="modal-thumbnail" />
        <div class="product-header">
          <h2>{{ selectedProduct.title }}</h2>
          <button class="add-to-cart-button" @click="addToCart(selectedProduct)">Add to Cart</button>
        </div>
        <p><strong>Category:</strong> {{ selectedProduct.category }}</p>
        <p><strong>Price:</strong> ${{ selectedProduct.price.toFixed(2) }}</p>
        <p><strong>Rating:</strong> {{ selectedProduct.rating }}</p>

        <h3>Reviews</h3>
        <div class="reviews">
          <div v-for="review in paginatedReviews" :key="review.reviewerEmail" class="review">
            <p><strong>{{ review.reviewerName }}</strong> ({{ review.rating }})</p>
            <p>{{ review.comment }}</p>
            <div class="rating-bar-container">
              <div class="rating-bar" :style="{ width: (review.rating / 5) * 100 + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- Pagination for Reviews -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
      </div>
    </div>

    <!-- Back to Top Button -->
    <button v-if="showBackToTop" class="back-to-top" @click="scrollToTop">↑ Back to Top</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { downloadProductList } from './download-product-list';
import { addToCart } from '../cartState';

const products = ref([]);  // List of products
const selectedSort = ref('');  // Sorting key (price, title, rating)
const selectedProduct = ref(null);  // Selected product for modal
const showModal = ref(false);       // Modal visibility state
const currentPage = ref(1);         // Pagination for reviews
const reviewsPerPage = 2;           // Number of reviews per page
const showBackToTop = ref(false);
const priceSortDirection = ref('asc');  // Sort direction for price
const titleSortDirection = ref('asc');  // Sort direction for name
const ratingSortDirection = ref('desc');  // Sort direction for rating (default to descending)

// Fetch products on component mount
onMounted(async () => {
  products.value = await downloadProductList();
  window.addEventListener('scroll', handleScroll); // Listen for scroll events
});

// Cleanup the scroll event listener when the component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Show Back to Top button when user scrolls down
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300; // Show the button after scrolling 300px
};

// Scroll to the top of the page
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// Computed property to filter and sort products
const filteredProducts = computed(() => {
  let result = [...products.value]; // Clone the product array

  // Apply sorting based on the selected sort key
  if (selectedSort.value === 'price') {
    result.sort((a, b) => (priceSortDirection.value === 'asc' ? a.price - b.price : b.price - a.price));
  } else if (selectedSort.value === 'title') {
    result.sort((a, b) => (titleSortDirection.value === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)));
  } else if (selectedSort.value === 'rating') {
    result.sort((a, b) => (ratingSortDirection.value === 'asc' ? a.rating - b.rating : b.rating - a.rating));
  }

  return result;
});

// Toggle sorting by price
const sortByPrice = () => {
  selectedSort.value = 'price';
  priceSortDirection.value = priceSortDirection.value === 'asc' ? 'desc' : 'asc';
};

// Toggle sorting by name
const sortByTitle = () => {
  selectedSort.value = 'title';
  titleSortDirection.value = titleSortDirection.value === 'asc' ? 'desc' : 'asc';
};

// Toggle sorting by rating
const sortByRating = () => {
  selectedSort.value = 'rating';
  ratingSortDirection.value = ratingSortDirection.value === 'asc' ? 'desc' : 'asc';
};

// Open product modal
const openProductModal = (product) => {
  selectedProduct.value = product;
  currentPage.value = 1;  // Reset review pagination
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  selectedProduct.value = null;
};

// Delete product from grid by id
const deleteProduct = (productId) => {
  products.value = products.value.filter(product => product.id !== productId);
};

// Pagination logic for reviews
const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * reviewsPerPage;
  const end = start + reviewsPerPage;
  return selectedProduct.value ? selectedProduct.value.reviews.slice(start, end) : [];
});

// Calculate total pages for reviews pagination
const totalPages = computed(() => {
  return selectedProduct.value ? Math.ceil(selectedProduct.value.reviews.length / reviewsPerPage) : 1;
});

// Go to next page for reviews
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

// Go to previous page for reviews
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

// Get background color based on product category
const getCategoryColor = (category) => {
  const categoryColors = {
    beauty: '#ffe4e1',
    electronics: '#e0ffff',
    groceries: '#f0e68c',
    fashion: '#ffebcd',
  };
  return categoryColors[category] || '#f0f0f0';  // Default color if category doesn't match
};
</script>


