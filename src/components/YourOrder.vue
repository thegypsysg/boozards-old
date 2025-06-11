<template>
  <div class="" style="background: #f8f8f8">
    <v-container>
      <h2 class="font-weight-black mb-6">Your Orders</h2>
      <div class="d-flex ga-4 text-caption" style="overflow-x: auto">
        <v-btn
          variant="plain"
          class="rounded-xl text-white"
          style="background: #0596d5"
          >View All</v-btn
        >
        <v-btn
          variant="outlined"
          style="border: 1px solid grey"
          class="rounded-xl text-red-darken-4 font-weight-bold"
          >Current</v-btn
        >
        <v-btn
          variant="outlined"
          style="border: 1px solid grey"
          class="rounded-xl text-red-darken-4 font-weight-bold"
          >Confirmed</v-btn
        >
        <v-btn
          variant="outlined"
          style="border: 1px solid grey"
          class="rounded-xl text-red-darken-4 font-weight-bold"
          >Cancelled</v-btn
        >
      </div>
    </v-container>
    <v-sheet
      class="d-flex justify-start mx-0 mx-md-16 mt-10"
      style="background: #f8f8f8"
      elevation="0"
    >
      <v-slide-group class="pa-0">
        <v-slide-group-item v-for="i in 6" :key="i" v-slot="{ toggle }">
          <v-lazy min-height="150">
            <v-card
              @click="toggle"
              class="mx-2 mx-md-4 pa-4"
              :min-width="isSmall ? 200 : 350"
            >
              <div class="d-flex font-weight-black ga-6 text-caption">
                <div class="">
                  <p>Payment By</p>
                  <p class="text-red">Paynow</p>
                </div>
                <div class="">
                  <p>Delivery Status</p>
                  <p class="text-red">Pending</p>
                </div>
              </div>
              <div class="d-flex align-center ga-6 mt-4">
                <div class="">
                  <span class="text-red">1</span> Items |
                  <span class="text-blue-lighten-1">S$ 90.10</span>
                </div>
                <span
                  class="font-weight-black text-purple-darken-1 text-caption"
                  >View Details</span
                >
              </div>
              <p class="font-weight-black text-caption mt-4">
                Order Status :
                <span class="text-red">Confirmed Payment Pending</span>
              </p>
            </v-card>
          </v-lazy>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const screenWidth = ref(window.innerWidth);

const isSmall = computed(() => screenWidth.value < 640);

const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
