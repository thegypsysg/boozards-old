<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import drink from "@/assets/images/boozards/drink2.jpg";
import whisky from "@/assets/images/boozards/drinnk.jpg";


const isLogin = ref(false)
const screenWidth = ref(window.innerWidth)
const showScrollButton = ref(false)

const footerData = ref({
  company_name: 'Boozards',
  description: 'Boozards is a',
  location: 'Marine Parade, Singapore',
  mobile_number: '+6591992000',
  whats_app: '+6591992000',
  email_id: 'helpme@the-gypsy.sg',
  copyright: '© The Gypsy International | Singapore, 2023 - 2025',
})

const quickLinks = ref([
  'Monkey Shoulders',
  'Johnnie Walker',
  'Chivas Regal',
  'Jameson',
  'Ballentines'
])

const trendingCard = [
  {
    id: 1,
    img: drink,
    title: 'Whiskey',
  },
  {
    id: 2,
    img: whisky,
    title: 'Gin',
  },
  {
    id: 3,
    img: drink,
    title: 'Vodka',
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=400",
    title: 'Rum',
  },
  {
    id: 5,
    img: drink,
    title: 'Single Malt',
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=400",
    title: 'Beer',
  }
]
// Computed properties
const isSmall = computed(() => screenWidth.value < 640)

// Methods
const handleResize = () => {
  screenWidth.value = window.innerWidth
}


const applyJob = () => {
  const userName = localStorage.getItem('userName')
  if (userName == 'null' || userName == null) {
    isLogin.value = true
  }
  // Add other conditions if needed
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleScroll = () => {
  showScrollButton.value = window.scrollY > 100
}

// Add this method to handle scrolling
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="footer-wrapper">
    <v-container fluid class="footer-container" :class="{ 'flex-column': isSmall }">
      <v-row class="gx-5" :class="{ 'flex-column': isSmall }">
        <!-- About Section -->
        <v-col cols="12" md="3">
          <h2 class="footer-title">About Boozards</h2>
          <p class="description mt-6 mb-6">Boozards is a</p>
          <div class="contact-info">
            <div class="d-flex align-center mb-4">
              <v-icon color="#FF1B6D" size="20" class="mr-3">mdi-map-marker</v-icon>
              <span>{{ footerData.location }}</span>
            </div>
            <div class="d-flex align-center mb-4">
              <v-icon color="#FF1B6D" size="20" class="mr-3">mdi-phone</v-icon>
              <span>{{ footerData.mobile_number }}</span>
            </div>
            <div class="d-flex align-center mb-4">
              <v-icon color="#FF1B6D" size="20" class="mr-3">mdi-whatsapp</v-icon>
              <span>{{ footerData.whats_app }}</span>
            </div>
            <div class="d-flex align-center mb-4">
              <v-icon color="#FF1B6D" size="20" class="mr-3">mdi-email</v-icon>
              <span class="email-link">{{ footerData.email_id }}</span>
            </div>
          </div>
        </v-col>

        <!-- Our Brands -->
        <v-col cols="12" md="3">
          <h2 class="footer-title">Our Brands</h2>
          <ul class="quick-links mt-6">
            <li v-for="(link, index) in quickLinks" :key="index" class="mb-4">
              {{ link }}
            </li>
          </ul>
          <div class="mt-4">
            <a href="#" @click.prevent="scrollToSection('ourBrands')" class="view-all">View all</a>
          </div>
        </v-col>

        <!-- Our Booze -->
        <v-col cols="12" md="3">
          <h2 class="footer-title">Our Booze</h2>
          <div class="categories-grid mt-6">
            <v-row dense>
              <v-col v-for="item in trendingCard" 
                     :key="item.id" 
                     cols="4" 
                     :class="{ 'pa-1': isSmall, 'pa-3': !isSmall }">
                <div class="category-item">
                  <div class="category-title mb-2">{{ item.title }}</div>
                  <v-img :src="item.img" 
                         :height="isSmall ? '60' : '80'" 
                         cover 
                         class="rounded">
                  </v-img>
                </div>
              </v-col>
            </v-row>
          </div>
          <div class="mt-4">
            <a href="#" @click.prevent="scrollToSection('ourBooze')" class="view-all">View all</a>
          </div>
        </v-col>

        <!-- Mobile App Section -->
        <v-col cols="12" md="3">
          <div class="mobile-app-section">
            <p class="coming-soon">Coming Soon...</p>
            <p class="explore-text">Explore 4 Walls on your Mobile</p>
            <div class="store-buttons">
              <a href="#" class="store-link">
                <img src="../assets/images/play-store.jpg" alt="Google Play"/>
              </a>
              <a href="#" class="store-link">
                <img src="../assets/images/app-store.jpg" alt="App Store"/>
              </a>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Bottom Footer -->
    <v-footer class="bg-black">
      <v-container fluid>
        <v-row no-gutters align="center" :justify="isSmall ? 'center' : 'end'" class="flex-wrap">
          <v-col :cols="isSmall ? '12' : 'auto'" class="text-center">
            <span class="text-white copyright-text">{{ footerData.copyright }}</span>
          </v-col>
          <v-col :cols="isSmall ? '12' : 'auto'" class="text-center mt-2">
            <div class="social-icons">
              <v-btn v-for="icon in ['facebook', 'twitter', 'instagram', 'youtube']" 
                     :key="icon" 
                     :icon="`mdi-${icon}`"
                     variant="text" 
                     color="#FF1B6D" 
                     density="comfortable" 
                     class="mx-1" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <!-- Add back the scroll to top button -->
    <v-btn v-show="showScrollButton" @click="scrollToTop" class="scroll-to-top" icon="mdi-arrow-up" color="#FF1B6D"
      size="large"></v-btn>
  </div>
</template>

<style scoped>
.footer-wrapper {
  margin-top: 1rem;
  width: 100%;
  background-color: white;
}

.footer-container {
  padding: 40px 16px;
  width: 100%;
}

/* Add media query for small devices */
@media (max-width: 600px) {
  .footer-container {
    padding: 24px 16px;
  }

  .category-item {
    margin-bottom: 8px;
  }

  .category-title {
    font-size: 10px;
  }

  .mobile-app-section {
    text-align: center;
    margin-top: 24px;
  }

  .store-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .store-link img {
    width: 100px;
    height: auto;
  }

  .copyright-text {
    font-size: 12px;
  }

  .social-icons {
    margin-top: 8px;
  }
}

.bg-white {
  background-color: white !important;
}

.bottom-footer {
  padding-bottom: env(safe-area-inset-bottom) !important;
  /* For iOS devices */
}

.footer-title {
  font-size: 24px;
  font-weight: 600;
  position: relative;
  padding-bottom: 12px;
  margin-bottom: 8px;
}

.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 60px;
  height: 3px;
  background-color: #FF1B6D;
}

.quick-links {
  list-style: none;
  padding: 0;
}

.quick-links li {
  font-size: 16px;
  line-height: 1.5;
}

.description {
  line-height: 1.6;
}

.category-item {
  transition: transform 0.3s ease;
}

.category-item:hover {
  transform: scale(1.05);
}

.category-title {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.view-all {
  color: #FF1B6D;
  text-decoration: none;
  font-weight: 500;
}


.store-button {
  text-decoration: none;
  color: inherit;
}

.store-btn {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #000;
  color: white;
  min-width: 100px;
  transition: all 0.3s ease;
}

.store-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.store-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.store-small-text {
  font-size: 0.7rem;
  letter-spacing: 0.5px;
}

.store-large-text {
  font-size: 1.1rem;
  font-weight: 500;
}

.google-play {
  background-color: #000;
}

.apple-store {
  background-color: #000;
}

.placeholder-loader {
  width: 100%;
  height: 100%;
  background: linear-gradient(-90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  background-size: 400% 400%;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    background-position: 0% 0%;
  }

  100% {
    background-position: -135% 0%;
  }
}

:deep(.v-container) {
  max-width: 100%;
  width: 100%;
  margin: 0;
  padding: 16px;
}

.scroll-to-top {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 99;
  border-radius: 50% !important;
  background-color: #FF1B6D !important;
  color: white !important;
  width: 48px !important;
  height: 48px !important;
  box-shadow: 0 2px 8px rgba(255, 27, 109, 0.3);
  transition: all 0.3s ease;
}

.scroll-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(255, 27, 109, 0.4);
}

.v-footer {
  white-space: nowrap;
  /* Prevents text from wrapping */
}

.v-footer .v-btn {
  opacity: 0.8;
}

.v-footer .v-btn:hover {
  opacity: 1;
}

.email-link {
  color: #00E1D2;
  /* Turquoise/cyan color */
  text-decoration: none;
}

.coming-soon {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.explore-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 16px;
}

.store-button {
  text-decoration: none;
  display: block;
}

.store-button img {
  height: 40px;
  object-fit: contain;
}

.store-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.store-link img {
  width: 120px;
  height: 30px;
  object-fit: contain;
  border-radius: 8px;
}

.copyright-text {
  font-size: 12px;
}

.social-icons {
  margin-top: 8px;
}
</style>