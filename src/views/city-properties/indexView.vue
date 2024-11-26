<template>
  <Banner />
  <div style="
      min-height: 100vh;
      position: relative;
      z-index: 2;
      background-color: #fff;
      margin-top: 100vh;
    ">
    <v-container class="mx-auto px-4" style="max-width: 1400px">
      <Slider />
    </v-container>
    <div class="mx-auto px-10 w-100">
      <FeaturedProject />
    </div>

    <v-container class="mx-auto px-4 medium:px-16" style="max-width: 1200px">
      <FeaturedMove />
      <Interested class="mt-10" />
      <Portfolio class="mt-10" />
    </v-container>

    <v-container class="mx-auto px-4" style="max-width: 1400px">
      <ForSale class="mt-10" />
    </v-container>

    <v-container class="mx-auto px-4 medium:px-16" style="max-width: 1200px">
      <Guide class="mt-10" />
    </v-container>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'

import Banner from './partials/banner'
import Slider from './partials/slider'
import FeaturedProject from './partials/featured-project'
import FeaturedMove from './partials/featured-move'
import Interested from './partials/interested'
import Portfolio from './partials/portfolio'
import ForSale from './partials/for-sale'
import Guide from './partials/guide'

</script>

<style>
.v-field--variant-filled .v-field__overlay {
  background-color: white !important;
}

.v-field__outline {
  display: none;
}

.carousel__prev {
  left: -33px;
}

.carousel__next {
  right: -33px;
}

.carousel__track {
  align-items: start;
}
</style>
