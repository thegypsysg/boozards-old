<template>
  <div class="w-100">
    <div class="d-flex gap-2 justify-center ga-3 mt-12">
      <span class="mdi mdi-office-building-outline"></span>
      <span>FEATURED PROJECT</span>
    </div>
    <div class="featured-title text-h4 text-md-h3 text-center mt-6">
      EXPLORE NEW & UPCOMING PROJECTS IN BATAM
    </div>

    <div class="featured-sub-title text-center text-grey-darken-1 mt-6">
      READY TO INVEST IN OUR PORTFOLIO OF NEW PROJECTS FOR INVESTMENT OR RESIDENTIAL
    </div>

    <Carousel v-bind="settings" :breakpoints>
      <Slide v-for="(data, i) in listData" :key="i">
        <v-hover v-slot:default="{ isHovering, props }">
          <v-responsive class="rounded pa-sm-2 align-start">
            <v-container class="rounded pa-0 pa-sm-2">
              <v-img :src="data.img" cover style="height: 100%" aspect-ratio="1.5">
                <div v-bind="props" :style="[
                  isHovering
                    ? 'background-color: rgba(0, 0, 0, 0.0)'
                    : 'background-color: rgba(0, 0, 0, 0.3)',
                  'transition: background-color 0.3s ease',
                ]" class="fill-height pa-6 text-white font-weight-light">
                </div>
              </v-img>
              <div class="d-flex flex-column ga-2 mt-2">
                <div class="d-flex flex-column ga-2 align-center justify-start">
                  <div class="font-weight-medium text-h6 d-block text-truncate text-start" style="width:100%">{{
                    data.title }}</div>
                </div>
                <p class="text-start">{{ data.description }}</p>
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
  </div>
</template>

<script setup lang="ts">
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import img18 from '@/assets/images/18.jpg'
import img19 from '@/assets/images/19.jpg'
import img20 from '@/assets/images/20.jpg'
import img21 from '@/assets/images/21.jpg'

const settings: breakpoints = {
  itemsToShow: 1,
  snapAlign: 'center',
  wrapAround: true
};

const breakpoints = {
  // 200px and up
  200: {
    itemsToShow: 1,
    snapAlign: 'left',
  },
  // 640px and up
  768: {
    itemsToShow: 2,
    snapAlign: 'left',
  },
  // 700px and up
  1024: {
    itemsToShow: 3,
    snapAlign: 'left',
  },
};

const listData = [
  {
    img: img18,
    title: "Modern Apartments for Urban Living",
    description: 'Discover our selection of contemporary apartments, perfect for those seeking comfort and convenience in the heart of Dubai. With a variety of floor plans and amenities, these homes are designed to suit every lifestyle.',
  },
  {
    img: img19,
    title: "Spacious Single-Family Homes",
    description: 'Perfect for growing families, our single-family homes offer ample space, modern designs, and family-friendly neighborhoods. Experience a lifestyle of comfort and security in these beautiful residences.',
  },
  {
    img: img20,
    title: "Stylish Condos in Prime Locations",
    description: 'Our condos offer the perfect blend of luxury and practicality. Located in some of Dubai’s most desirable areas, these homes provide the ideal balance of privacy, community, and access to the city’s best attractions.',

  },
  {
    img: img21,
    title: "Elegant Villas with Exclusive Features",
    description: 'Experience the height of sophistication in our stunning villas. With private gardens, spacious interiors, and luxurious finishes, these homes are perfect for those seeking an elevated lifestyle in Dubai’s most prestigious areas.',

  },
]

</script>

<style scoped></style>
