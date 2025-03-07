<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from "@/composables/useCart";
import axios from '@/util/axios'
import { fileURL } from "@/main";
import { appId } from '@/main'

const route = useRoute()
const { isInCart, cartQuantity, addToCart, increaseQuantity, decreaseQuantity } = useCart();
const product = ref(null)
const selectedRange = ref(null);
const isLoading = ref(false)
const screenWidth = ref(window.innerWidth)
const isCount = ref(false)
const count = ref(1)


// Computed property for screen size check
const isSmall = computed(() => screenWidth.value < 640)



const getProductDetails = async () => {
  try {
    isLoading.value = true
    const encryptedId = route.params.encryptedId
    const rangeId = route.query.range_id
    const response = await axios.get(`/product/${encryptedId}`)
    product.value = response.data.data
    selectedRange.value = product.value.ranges.find(range => range.range_id === Number(rangeId));

    console.log(selectedRange.value)
  } catch (err) {
    console.error('Error fetching product:', err)
  } finally {
    isLoading.value = false
  }
}

// Function to update screen width on resize
const handleResize = () => {
    screenWidth.value = window.innerWidth
}

// Add event listener when component is mounted
onMounted(() => {
  getProductDetails();
  window.addEventListener('resize', handleResize)
})

// Remove event listener when component is unmounted
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>


<template>

<div class="pt-16 px-4 px-md-16">
  <v-container>
    <v-row class="mt-10" justify="center" align="center" style="min-height: 50vh">
      <!-- Loading Indicator -->
      <v-col cols="12" v-if="isLoading" class="d-flex justify-center align-center">
        <v-progress-circular indeterminate color="primary" size="50" width="5"></v-progress-circular>
      </v-col>

      <!-- Product Details -->
      <v-col cols="12" v-else>
        <v-row justify="center" >
          <v-col cols="12" md="6" class="pa-5">
            <v-img  :src="fileURL + product?.image"></v-img>
          </v-col>
          <v-col cols="12" md="6"  class="pa-5">
              <h3 class="text-red mb-3">{{ product?.brand.brand_name }}</h3>
              <h2 class="mb-4">{{ product?.product_name }} <span class="text-blue">{{ selectedRange?.quantity.quantity_name }}</span></h2>
              <v-row no-gutters class="mb-3">
                <v-col cols="12" md="8" >
                  <v-row>
                    <v-col cols="5"><strong>Alcohol %</strong></v-col>
                    <v-col cols="1" class="text-center">:</v-col>
                    <v-col cols="6" class="text-right">40 %</v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters class="mb-3">
                <v-col cols="12" md="8" >
                  <v-row>
                    <v-col cols="5"><strong>Bottle Volume</strong></v-col>
                    <v-col cols="1" class="text-center">:</v-col>
                    <v-col cols="6" class="text-right">{{ selectedRange?.quantity.quantity_name }}</v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters class="mb-3">
                <v-col cols="12" md="8" >
                  <v-row>
                    <v-col cols="5"><strong>Origin</strong></v-col>
                    <v-col cols="1" class="text-center">:</v-col>
                    <v-col cols="6" class="text-right">{{ product?.brand.country.country_name }}</v-col>
                  </v-row>
                </v-col>
              </v-row>

              <span class="pt-2" v-if="selectedRange != null">
                  <v-btn
                    v-if="!isInCart(product,selectedRange)"
                    @click="addToCart(product,selectedRange)"
                    rounded=""
                    color="black"
                    class="py-1 px-8"
                    variant="flat"
                    >Add To Cart</v-btn
                  >
                  <div
                    v-else="isInCart(product,selectedRange)"
                    class="d-flex align-center ga-3"
                  >
                    <v-btn
                      size="lg"
                      color="black"
                      class="rounded-0"
                      variant="flat"
                      icon
                      @click="decreaseQuantity(product,selectedRange)"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>

                    <span>
                      {{ cartQuantity(product,selectedRange) }}
                    </span>

                    <v-btn
                      size="lg"
                      color="black"
                      class="rounded-0"
                      variant="flat"
                      icon
                      @click="increaseQuantity(product,selectedRange)"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </div>
                </span>
              <!-- <div class="d-flex justify-space-between align-center">
                <strong>Alcohol %</strong>
                <span class="mx-2">:</span>
                <span>{{ product?.percentage  }} %</span>
              </div>
              <div class="d-flex justify-space-between align-center">
                <strong>Bottle Volume</strong>
                <span class="mx-2">:</span>
                <span>700 ml</span>
              </div>
              <div class="d-flex justify-space-between align-center">
                <strong>Origin</strong>
                <span class="mx-2">:</span>
                <span>Scotland</span>
              </div> -->
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</div>
<Footer />
</template>

<style scoped>
.card-wrapper {
  margin: 0.5rem;
  overflow: hidden;
  background: white;
  transition: transform 0.2s ease;
}
</style>
