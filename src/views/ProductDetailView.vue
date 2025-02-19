<script>
import axios from "@/util/axios";
import { appId } from "@/main";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "ProductDetailView",
  data() {
    return {
      isLoading: false,
      screenWidth: window.innerWidth,
      isCount: false,
      count: 1,
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {},
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
  },
};
</script>

<script setup>
import productImage from "@/assets/images/boozards/drink3.jpg";
</script>

<template>
  <div
    class="pt-16 px-4 px-md-16"
    :style="{ background: !isSmall ? '#f4f5f7' : '' }"
  >
    <template v-if="!isSmall">
      <v-row class="mt-10">
        <v-col cols="6">
          <v-card class="card-wrapper" height="400" elevation="3">
            <v-img :src="productImage" height="400" cover></v-img>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="card-wrapper px-16 py-10" height="300" elevation="3">
            <div
              class="card-title d-flex flex-column justify-space-between"
              style="height: 170px"
            >
              <p class="text-red-darken-4 font-weight-bold text-h6">
                <!-- {{ menu?.brand_name }} -->
                Monkey Shoulders
              </p>
              <p class="font-weight-bold text-black text-h6">
                <!-- {{ menu?.product_name }} -->
                Monkey Shoulders Original
              </p>
              <div class="d-flex align-center ga-1 my-2">
                <!-- <template v-for="item in menu?.rangeItems" :key="item.pq_id"> -->
                <v-btn
                  size="md"
                  color="black"
                  class="text-caption pa-1 rounded-lg"
                  variant="outlined"
                  >700 ML</v-btn
                >
                <!-- :variant="item.selected.value ? 'flat' : 'outlined'"
                   @click="handleSelectRange(menu, item)" -->
                <!-- </template> -->
              </div>
              <div class="d-flex justify-space-between align-center mt-10">
                <span class="text-red-darken-1 text-h5 font-weight-bold">
                  <!-- <template v-if="menu?.selectedPrice.value">
                    S$ {{ menu?.selectedPrice.value }}
                  </template> -->
                  S$ 75.00
                </span>
                <!-- v-if="menu.isCount.value == false"
                @click="menu.isCount.value = true" -->
                <v-btn
                  v-if="isCount == false"
                  @click="isCount = true"
                  size="md"
                  color="black"
                  class="text-caption py-2 px-10"
                  variant="flat"
                  >Add</v-btn
                >
                <div v-if="isCount == true" class="d-flex align-center ga-2">
                  <v-btn
                    size="md"
                    color="black"
                    class="text-caption pa-1 rounded-0"
                    variant="flat"
                    icon
                    @click="if (count > 1) count--;"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>

                  <span>
                    {{ count }}
                  </span>

                  <v-btn
                    size="md"
                    color="black"
                    class="text-caption pa-1 rounded-0"
                    variant="flat"
                    icon
                    @click="count++"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <div class="mt-5">
        <p class="text-black font-weight-bold text-body-1">
          <!-- {{ menu?.brand_name }} -->
          Monkey Shoulders Original Blended Whisky - 700 ml
        </p>
        <p class="font-weight-bold text-black text-body-1">
          <!-- {{ menu?.product_name }} -->
          40% | Scotland
        </p>
        <v-img :src="productImage" height="300" class="my-4" cover></v-img>
        <div class="d-flex flex-column justify-center align-center my-8">
          <span class="text-black text-h6 font-weight-bold mb-8">
            <!-- <template v-if="menu?.selectedPrice.value">
              S$ {{ menu?.selectedPrice.value }}
            </template> -->
            S$ 75.00
          </span>
          <!-- v-if="menu.isCount.value == false"
          @click="menu.isCount.value = true" -->
          <v-btn
            v-if="isCount == false"
            @click="isCount = true"
            size="md"
            color="black"
            class="text-caption py-2 px-10"
            variant="flat"
            >Add</v-btn
          >
          <div v-if="isCount == true" class="d-flex align-center ga-2">
            <v-btn
              size="md"
              color="black"
              class="text-caption pa-1 rounded-0"
              variant="flat"
              icon
              @click="if (count > 1) count--;"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>

            <span>
              {{ count }}
            </span>

            <v-btn
              size="md"
              color="black"
              class="text-caption pa-1 rounded-0"
              variant="flat"
              icon
              @click="count++"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
        </div>
        <p class="font-weight-bold text-blue-darken-4 text-body-2 mb-8">
          Additional Charges
        </p>
        <v-row no-gutters class="font-weight-bold text-black text-body-2 mb-4">
          <v-col cols="8">
            <p>Fixed Delivery Charges</p>
          </v-col>
          <v-col cols="1">
            <span>:</span>
          </v-col>
          <v-col cols="3">
            <p>S$ 12/-</p>
          </v-col>
        </v-row>
        <v-row no-gutters class="font-weight-bold text-black text-body-2 mb-4">
          <v-col cols="8">
            <p>Service Charges</p>
          </v-col>
          <v-col cols="1">
            <span>:</span>
          </v-col>
          <v-col cols="3">
            <p>S$ 0.20</p>
          </v-col>
        </v-row>
        <v-row no-gutters class="font-weight-bold text-black text-body-2">
          <v-col cols="8">
            <p>Platform Charges</p>
          </v-col>
          <v-col cols="1">
            <span>:</span>
          </v-col>
          <v-col cols="3">
            <p>S$ 0.30</p>
          </v-col>
        </v-row>
      </div>
    </template>
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
