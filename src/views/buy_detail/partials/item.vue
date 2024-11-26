<template>
  <Carousel v-bind="settings" :breakpoints>
    <Slide v-for="item in items" :key="item?.ca_id">
      <v-hover v-slot:default="{ isHovering, props }">
        <v-responsive class="rounded pa-sm-2 align-start">
          <v-container class="rounded bg-white">
            <v-img
              :src="$fileURL + item?.main_image"
              cover
              aspect-ratio="1.3"
              style="height: 100%"
            >
              <div
                v-bind="props"
                :style="[
                  isHovering
                    ? 'background-color: rgba(0, 0, 0, 0.0)'
                    : 'background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%)',
                  'transition: background-color 0.3s ease',
                ]"
                class="fill-height px-4 py-4 text-white font-weight-light"
              >
                <div
                  class="d-flex flex-column justify-space-between align-end fill-height"
                >
                  <!-- <div
                    class="d-flex flex-column justify-end align-end ga-1 w-100"
                  > -->
                  <v-badge
                    color="black"
                    content="FOR SALE"
                    inline
                    rounded="0"
                    class="custom-badge"
                    align="left"
                  />
                  <div class="d-flex ga-1">
                    <v-btn
                      density="compact"
                      icon="mdi-arrow-expand"
                      variant="text"
                      class="btn-opacity rounded"
                    />
                    <v-btn
                      density="compact"
                      icon="mdi-heart-outline"
                      variant="text"
                      class="btn-opacity rounded"
                    />
                    <v-btn
                      density="compact"
                      icon="mdi-cog-outline"
                      variant="text"
                      class="btn-opacity rounded"
                    />
                  </div>
                  <!-- </div> -->
                </div>
              </div>
            </v-img>
            <div class="d-flex flex-column justify-center ga-2 mt-2">
              <div class="mt-4">
                <div class="font-weight-bold text-h6">
                  {{ item?.property_name }}, {{ toStr(item?.bedrooms) }} Bedroom
                </div>
              </div>
              <div class="mt-2">
                <div class="">From ${{ toNum(item?.price_range) }}</div>
                <div class="text-caption font-weight-light mt-2">
                  {{ item?.apartment_type_name.toUpperCase() }}
                </div>
              </div>
              <div class="d-flex justify-center ga-3 mt-4">
                <div class="d-flex ga-1 align-center">
                  <v-icon icon="mdi-bed-king-outline" />
                  <div class="font-weight-medium text-caption text-md-body-2">
                    {{ item?.bedrooms }}
                  </div>
                </div>
                <div class="d-flex ga-1 align-center">
                  <v-icon icon="mdi-shower-head" />
                  <div class="font-weight-medium text-caption text-md-body-2">
                    {{ item?.bathrooms }}
                  </div>
                </div>

                <div class="d-flex ga-1 align-center">
                  <v-icon icon="mdi-ruler-square" />
                  <div class="font-weight-medium text-caption text-md-body-2">
                    {{ item?.area }} Sq Ft
                  </div>
                </div>
              </div>
            </div>
          </v-container>
        </v-responsive>
      </v-hover>
    </Slide>

    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<script setup>
import { ref } from "vue";
import { toWords } from "number-to-words";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

const settings = ref({
  itemsToShow: 1,
  snapAlign: "center",
});

const breakpoints = ref({
  // 200px and up
  200: {
    itemsToShow: 1,
    snapAlign: "left",
    wrapAround: true,
  },
  // 640px and up
  768: {
    itemsToShow: 2,
    snapAlign: "left",
  },
  // 700px and up
  1024: {
    itemsToShow: 3,
    snapAlign: "left",
  },
});

const toStr = (str) => {
  const res = toWords(str);
  return res
    .split(" ") // Pisahkan kata-kata berdasarkan spasi
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Kapitalisasi huruf pertama setiap kata
    .join(" "); // Gabungkan kembali menjadi satu string
};

const toNum = (str) => {
  return new Intl.NumberFormat("id-ID").format(str);
};

const props = defineProps({
  items: { type: Array },
});
</script>

<style scoped>
.btn-opacity {
  opacity: 0.7;
}
</style>
