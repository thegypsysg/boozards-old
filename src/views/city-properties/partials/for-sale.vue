<template>
  <div v-for="(item, j) in sale_items" :key="j">
    <div class="d-flex justify-space-between align-center">
      <div class="text-md-h4 font-weight-bold">{{ item }}</div>
      <div class="text-cyan-darken-2">View All</div>

    </div>

    <Carousel v-bind="settings" :breakpoints>
      <Slide v-for="(img, i) in images" :key="i">
        <v-hover v-slot:default="{ isHovering, props }">
          <v-responsive class="rounded pa-2">
            <v-img :src="img.url" cover aspect-ratio="1.3" style="height: 100%;">
              <div v-bind="props" :style="[
                isHovering ? 'background-color: rgba(0, 0, 0, 0.0)' : 'background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%)',
                'transition: background-color 0.3s ease'
              ]" class="fill-height px-4 py-4 text-white font-weight-light">
                <div class="d-flex flex-column justify-end fill-height">
                  <div class="d-flex flex-column justify-start ga-1 w-100">
                    <v-badge color="black" content="FOR RENT" inline rounded="0" class="custom-badge" align="left" />
                    <div class="text-md-h6 font-weight-bold text-left">{{ img.price }}</div>
                    <div class="d-flex flex-column flex-md-row justify-space-between ga-3">
                      <div class="d-flex flex-column flex-md-row ga-md-3">
                        <div class="d-flex ga-3">
                          <div class="d-flex ga-1 align-center">
                            <v-icon icon="mdi-bed-king-outline" />
                            <div class="font-weight-medium text-caption text-md-body-2">
                              {{ img.facility.bed }}</div>
                          </div>
                          <div class="d-flex ga-1 align-center">
                            <v-icon icon="mdi-shower-head" />
                            <div class="font-weight-medium text-caption text-md-body-2"> {{
                              img.facility.shower }}</div>
                          </div>
                        </div>
                        <div class="d-flex ga-3">
                          <div class="d-flex ga-1 align-center">
                            <v-icon icon="mdi-car-back" />
                            <div class="font-weight-medium text-caption text-md-body-2"> {{
                              img.facility.car_park }}
                            </div>
                          </div>
                          <div class="d-flex ga-1 align-center">
                            <v-icon icon="mdi-ruler-square" />
                            <div class="font-weight-medium text-caption text-md-body-2">{{ img.facility.area
                              }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="d-none d-md-flex ga-1">
                        <v-btn density="compact" icon="mdi-arrow-expand" color="black" class="btn-opacity rounded" />
                        <v-btn density="compact" icon="mdi-heart-outline" color="black" class="btn-opacity rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-img>
          </v-responsive>
        </v-hover>
      </Slide>

      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

import img12 from '@/assets/images/12.jpg'
import img13 from '@/assets/images/13.jpg'
import img14 from '@/assets/images/14.jpg'
import img15 from '@/assets/images/15.jpg'
import img16 from '@/assets/images/16.jpg'
import img17 from '@/assets/images/17.jpg'

const settings: breakpoints = {
  itemsToShow: 1,
  snapAlign: 'center',
};

const breakpoints = {
  // 200px and up
  200: {
    itemsToShow: 1.5,
    snapAlign: 'center',
  },
  // 640px and up
  640: {
    itemsToShow: 2.5,
    snapAlign: 'center',
  },
  // 700px and up
  700: {
    itemsToShow: 3.5,
    snapAlign: 'center',
  },
};

const sale_items = [
  "Studio (8) in Batam for Sale",
  "Penthouse (3) in Batam for Sale",
  "Cond (2) in Batam",
];

const images = [
  {
    url: img12,
    featured: true,
    price: '$4,500/mo',
    facility: {
      bed: 4,
      shower: 2,
      car_park: 1,
      area: '1200 Sq Ft'
    }
  },
  {
    url: img13,
    featured: true,
    price: '$876,000',
    facility: {
      bed: 3,
      shower: 2,
      car_park: 1,
      area: '2560 Sq Ft'
    }
  },
  {
    url: img14,
    featured: true,
    price: '$11,000/mo',
    facility: {
      bed: 3,
      shower: 1,
      car_park: 1,
      area: '1789 Sq Ft'
    }
  },
  {
    url: img15,
    featured: false,
    price: '$5,600/mo',
    facility: {
      bed: 5,
      shower: 3,
      car_park: 1,
      area: '3450 Sq Ft'
    }
  },
  {
    url: img16,
    featured: false,
    price: '$3,500/mo',
    facility: {
      bed: 1,
      shower: 1,
      car_park: 1,
      area: '1760 Sq Ft'
    }
  },
  {
    url: img17,
    featured: false,
    price: '$3,750/mo',
    facility: {
      bed: 1,
      shower: 1,
      car_park: 1,
      area: '1678 Sq Ft'
    }
  }
]


</script>

<style scoped>
.custom-badge {
  opacity: 0.6;
}

.btn-opacity {
  opacity: 0.4;
}
</style>
