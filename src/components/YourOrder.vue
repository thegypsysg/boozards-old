<template>
  <div class="" style="background: #f8f8f8">
    <v-container>
      <h2 class="font-weight-black mb-6">Your Orders</h2>
      <div class="d-flex ga-4 text-caption" style="overflow-x: auto">
        <v-btn
          @click="changeOrder('all')"
          :variant="type == 'all' ? 'plain' : 'outlined'"
          :style="
            type == 'all' ? 'background: #0596d5' : 'border: 1px solid grey'
          "
          :class="
            type == 'all' ? 'text-white' : 'text-red-darken-4 font-weight-bold'
          "
          class="rounded-xl"
          >View All</v-btn
        >
        <v-btn
          @click="changeOrder('current')"
          :variant="type == 'current' ? 'plain' : 'outlined'"
          :style="
            type == 'current' ? 'background: #0596d5' : 'border: 1px solid grey'
          "
          :class="
            type == 'current'
              ? 'text-white'
              : 'text-red-darken-4 font-weight-bold'
          "
          class="rounded-xl"
          >Current</v-btn
        >
        <v-btn
          @click="changeOrder('completed')"
          :variant="type == 'completed' ? 'plain' : 'outlined'"
          :style="
            type == 'completed'
              ? 'background: #0596d5'
              : 'border: 1px solid grey'
          "
          :class="
            type == 'completed'
              ? 'text-white'
              : 'text-red-darken-4 font-weight-bold'
          "
          class="rounded-xl"
          >Completed</v-btn
        >
        <!-- <v-btn
        @click="changeOrder('cancelled')"
          :variant="type == 'cancelled' ? 'plain' : 'outlined'"
          :style="
            type == 'cancelled'
              ? 'background: #0596d5'
              : 'border: 1px solid grey'
          "
          :class="
            type == 'cancelled'
              ? 'text-white'
              : 'text-red-darken-4 font-weight-bold'
          "
          class="rounded-xl"
          >Cancelled</v-btn
        > -->
      </div>
    </v-container>
    <v-sheet
      v-if="!loading"
      class="d-flex justify-start mx-0 mx-md-16 mt-10"
      style="background: #f8f8f8"
      elevation="0"
    >
      <v-slide-group class="pa-0">
        <v-slide-group-item
          v-for="(item, index) in orders"
          :key="index"
          v-slot="{ toggle }"
        >
          <v-lazy min-height="150">
            <v-card
              @click="toggle"
              class="mx-2 mx-md-4 pa-4 mb-4"
              :min-width="isSmall ? 200 : 350"
            >
              <div class="d-flex font-weight-black ga-6 text-caption">
                <div class="">
                  <p>Payment By</p>
                  <p class="text-red">
                    {{ item?.payment_status?.payment_status_name }}
                  </p>
                </div>
                <div class="">
                  <p>Delivery Status</p>
                  <p class="text-red">{{ item?.delivery_status }}</p>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between ga-6 mt-4">
                <div class="">
                  <span class="text-red">{{ item?.total_items }}</span> Items |
                  <span class="text-blue-lighten-1"
                    >S$ {{ item?.final_amount }}</span
                  >
                </div>
                <v-btn
                  variant="plain"
                  class="font-weight-black text-caption"
                  style="background: #b7e1e4"
                  >View Details</v-btn
                >
              </div>
              <p class="font-weight-black text-caption mt-4">
                Order Status :
                <span class="text-red">{{
                  item?.order_status?.order_status_name
                }}</span>
              </p>
            </v-card>
          </v-lazy>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
    <div v-else class="text-center pb-8">
      <v-progress-circular :size="50" color="#fa2964" indeterminate />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "@/util/axios";

const screenWidth = ref(window.innerWidth);
const type = ref("all");
const orders = ref([]);
const loading = ref(false);

const isSmall = computed(() => screenWidth.value < 640);

const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

function changeOrder(value) {
  type.value = value;
  getOrder();
}

function getOrder() {
  loading.value = true;
  axios
    .get(`/get-orders/${type.value}`)
    .then((response) => {
      const data = response.data.data;
      console.log(data);
      orders.value = data;
      // let itemFinal = [];
    })
    .catch((error) => {
      console.log(error);
      throw error;
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  getOrder();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
