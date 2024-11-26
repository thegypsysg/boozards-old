<template>
  <div>
    <Carousel v-bind="settings" :breakpoints>
      <Slide v-for="(city, i) in cities" :key="i">
        <v-responsive class="border pa-4 ma-6">
          <div>
            <v-img :src="city.img" aspect-ratio="1.3" cover style="height: 100%;"></v-img>
            <div class="d-flex flex-column justify-center align-center">
              <div class="font-weight-bold">
                {{ city.city }}
              </div>
              <div>{{ city.properties }} properties</div>
            </div>
          </div>
        </v-responsive>
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

const cities = [
  {
    img: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
    city: 'Batam Center',
    properties: 2
  },
  {
    img: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
    city: 'Batam City',
    properties: 3
  },
  {
    img: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
    city: 'Baloi',
    properties: 1
  },
  {
    img: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
    city: 'Nagoya',
    properties: 4
  },
  {
    img: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
    city: 'Batam Center',
    properties: 2
  },
  {
    img: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
    city: 'Batam City',
    properties: 3
  },
  {
    img: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
    city: 'Baloi',
    properties: 1
  },
  {
    img: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
    city: 'Nagoya',
    properties: 4
  },
];

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
    itemsToShow: 2,
    snapAlign: 'center',
  },
  // 700px and up
  700: {
    itemsToShow: 3.5,
    snapAlign: 'center',
  },
  // 1024 and up
  1024: {
    itemsToShow: 4.5,
    snapAlign: 'start',
  },
  // 1280 and up
  1280: {
    itemsToShow: 5,
    snapAlign: 'start',
  },
};
</script>

<style scoped></style>
