<template>
  <!-- <Banner /> -->
  <div class="d-none d-md-flex justify-space-between align-center py-4 px-10 border-b" style="min-height: 90px;">
    <!-- <div class="drawer-logo" v-if="logo">
      <v-img height="35" width="80" :src="$fileURL + logo" />
    </div> -->
    <div class="d-flex align-center ga-4">
      <Logo />
      <div class="text-h5 font-weight-bold">Pollux SeaView Apartment Habibi</div>
    </div>


    <div v-if="!isSignin" style="height: 48px; width: 48px; border-radius: 50%; cursor: pointer" icon class="mr-4"
      @click="drawer = !drawer">
      <v-img v-if="userImage != null" :src="userImage" cover style="height: 100%; width: 100%; border-radius: 50%">
        <template #placeholder>
          <div class="skeleton" />
        </template>
      </v-img>
      <img v-else-if="userImage == null && !isLoading" src="@/assets/images/icons/user_icon.png" cover height="48"
        style="height: 100%; width: 100%" />
    </div>
  </div>

  <div id="studio-container" style="
      min-height: 100vh;
      position: relative;
      z-index: 2;
      background-color: #f7f8f9;
  ">
    <!-- FIXED on mobile -->
    <v-container class="d-md-none d-block position-fixed bottom-0 bg-white border-t" style="z-index: 10;">
      <div class="d-flex ga-2 align-center justify-space-between">
        <div class="d-flex ga-2 align-center">
          <v-avatar color="grey" size="50" style="border-radius: 5px;">
            <v-img src="https://demo03.houzez.co/wp-content/uploads/2016/02/agent-3-150x150.jpg" cover></v-img>
          </v-avatar>
          <div class="text-subtitle-1 font-weight-light">Samuel Palmer</div>
        </div>
        <div class="d-flex ga-2">
          <v-btn color="orange-darken-2" rounded="0" elevation="0" size="large" icon="mdi-chat-outline"
            class="rounded"></v-btn>
          <v-btn rounded="0" elevation="0" size="large" icon="mdi-whatsapp" class="rounded border border-orange">
            <v-icon icon="mdi-whatsapp" size="24" color="orange-darken-2"></v-icon>
          </v-btn>
          <v-btn rounded="0" elevation="0" size="large" icon="mdi-phone-outline" class="rounded border border-orange">
            <v-icon icon="mdi-phone-outline" size="24" color="orange-darken-2"></v-icon>
          </v-btn>
        </div>
      </div>
    </v-container>
    <div class="d-none d-md-block">
      <v-container>
        <v-row>
          <v-col class="d-flex flex-column flex-md-row justify-space-between">
            <div class="text-h4 font-weight-black">
              IDR: 10,000,000
            </div>
            <div>
              <v-badge color="black" content="FOR RENT" inline rounded="0" class="opacity-80" align="left" />
              <v-badge color="green" content="FOR RENT" inline rounded="0" class="opacity-80" align="left" />
            </div>
          </v-col>
          <v-col class="d-flex justify-end ga-3">
            <v-btn color="#f7f8f9" prepend-icon="mdi-tray-arrow-up" elevation="0">
              <template v-slot:prepend>
                <v-icon></v-icon>
              </template>
              Share
            </v-btn>
            <v-btn color="#f7f8f9" prepend-icon="mdi-heart" elevation="0">
              <template v-slot:prepend>
                <v-icon color="red"></v-icon>
              </template>
              Saved
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="w-100">
        <v-row>
          <v-col cols="6" class="d-flex flex-column pa-2">
            <Grid title="Image" image="https://demo03.houzez.co/wp-content/uploads/2016/02/038-1170x877.jpg"
              :isSquare="false" />
          </v-col>

          <v-col cols="6" md="3" class="pa-2">
            <v-row>
              <v-col>
                <Grid title="Image" image="https://demo03.houzez.co/wp-content/uploads/2016/02/038-1170x877.jpg"
                  :isSquare="true" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <Grid title="Image" image="https://demo03.houzez.co/wp-content/uploads/2016/02/038-1170x877.jpg"
                  :isSquare="true" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" md="3" class="pa-2">
            <v-row>
              <v-col>
                <Grid title="Image" image="https://demo03.houzez.co/wp-content/uploads/2016/02/038-1170x877.jpg"
                  :isSquare="true" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <Grid title="Image" image="https://demo03.houzez.co/wp-content/uploads/2016/02/038-1170x877.jpg"
                  :isSquare="true" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- MOBILE -->
    <v-container class="d-md-none pa-0" style="position: relative;">
      <div class="d-flex ga-3" style="position: absolute; right: 40px; top: 40px; z-index: 10;">
        <v-btn density="default" size="small" icon="mdi-tray-arrow-up"></v-btn>
        <v-btn density="default" size="small" icon="mdi-heart"></v-btn>
      </div>
      <Carousel v-bind="settings" :breakpoints>
        <Slide v-for="(item, i) in images" :key="i">
          <!-- <v-hover v-slot:default="{ isHovering, props }"> -->
          <v-responsive class="rounded pa-0" aspect-ratio="1.5">
            <v-img :src="item.image" cover style="height: 100%;">
            </v-img>
          </v-responsive>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>

      <v-container>
        <div class="text-h5 font-weight-bold">Pollux Habibie Seaview Apartment</div>
        <div class="d-flex justify-space-between mt-4">
          <div class="d-flex ga-2">
            <v-btn rounded="0" size="small" icon="mdi-newspaper-variant-outline"></v-btn>
            <v-btn rounded="0" size="small" icon="mdi-map-legend"></v-btn>
            <v-btn rounded="0" size="small" icon="mdi-map-marker-radius-outline"></v-btn>
          </div>
          <div class="d-flex ga-2">
            <v-btn rounded="0" size="small" icon="mdi-heart-outline"></v-btn>
            <v-btn rounded="0" size="small" icon="mdi-share-variant-outline"></v-btn>
          </div>
        </div>
        <div class="mt-4">
          <v-badge color="black" content="FOR RENT" inline rounded="0" class="opacity-80" align="left" />
          <v-badge color="green" content="FOR RENT" inline rounded="0" class="opacity-80" align="left" />
        </div>


        <div class="mt-4">
          <div class="font-weight-bold">Design Apartment</div>
          <div class="text-caption font-weight-light"><v-icon icon="mdi-map-marker-outline" size="18"></v-icon> Quency
            St,
            Brooklyn, NY, USA
          </div>
        </div>
        <div class="mt-4">
          <div class="font-weight-bold">$876.000</div>
          <div class="text-caption font-weight-light">$7,6090/sq ft</div>
        </div>

        <!-- <hr class="mt-4 mb-4">


        <hr class="my-4"> -->
      </v-container>


    </v-container>


    <Overview class="mt-6" />
    <Description class="mt-6" />
    <Address class="mt-6" />
    <Video class="mt-6" />
    <Contact class="mt-6" />

    <Footer />
  </div>
</template>

<script setup lang="ts">
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'


import Logo from '@/components/mainLogo.vue';
import Grid from '@/components/DesktopView/Happening/partials/grid.vue';
import Overview from './partials/overview.vue';
import Description from './partials/description.vue';
import Address from './partials/address.vue';
import Video from './partials/video.vue';
import Contact from './partials/contact.vue';

const images = [
  {
    title: "Image",
    image: "https://demo03.houzez.co/wp-content/uploads/2016/02/038-1170x877.jpg",
  },
  {
    title: "Image",
    image: "https://demo03.houzez.co/wp-content/uploads/2016/02/038-1170x877.jpg",
  },
  {
    title: "Image",
    image: "https://demo03.houzez.co/wp-content/uploads/2016/02/038-1170x877.jpg",
  },
  {
    title: "Image",
    image: "https://demo03.houzez.co/wp-content/uploads/2016/02/038-1170x877.jpg",
  },
  {
    title: "Image",
    image: "https://demo03.houzez.co/wp-content/uploads/2016/02/038-1170x877.jpg",
  },
  {
    title: "Image",
    image: "https://demo03.houzez.co/wp-content/uploads/2016/02/038-1170x877.jpg",
  },
]

const settings: breakpoints = {
  itemsToShow: 1,
  snapAlign: 'center',
};

const breakpoints = {
  // 200px and up
  200: {
    itemsToShow: 1,
    snapAlign: 'center',
  },
  // // 640px and up
  // 640: {
  //   itemsToShow: 2.5,
  //   snapAlign: 'center',
  // },
  // // 700px and up
  // 700: {
  //   itemsToShow: 3.5,
  //   snapAlign: 'center',
  // },
};


</script>

<style scoped>
.border-orange {
  border-color: #f7941d !important;
}

/* .border-orange .v-icon {
  color: #f7941d !important;
} */
</style>
