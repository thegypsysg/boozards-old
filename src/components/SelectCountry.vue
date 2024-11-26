<template>
  <div id="trending-grid-container mt-md-10 mt-sm-2">

    <v-row justify="center">
      <v-col cols="12">
        <p class="text-center my-6 text-h5 text-sm-h4 text-lg-h3" style="font-family: 'DM Serif Display', system-ui;
        font-weight: 400;">
          Country Selections
        </p>
        <div class="orange-underline mb-4"></div>
      </v-col>
    </v-row>

    <!-- DESKTOP VIEW -->
    <div class="d-none d-sm-block w-100">
      <v-row>
        <v-col cols="6" md="4" class="d-flex flex-column pa-2">
          <Grid v-if="images[0]" 
            :title="images[0].alt"
            :image="images[0].src" 
            :isSquare="false" 
            :show_text="true"
            :show_option="true" />
        </v-col>

        <v-col cols="6" md="4" class="pa-2">
          <v-row>
            <v-col>
              <Grid v-if="images[1]" 
                :title="images[1].alt"
                :image="images[1].src" 
                :isSquare="true" 
                :show_text="true"
                :show_option="true" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <Grid v-if="images[2]" 
                :title="images[2].alt"
                :image="images[2].src" 
                :isSquare="true" 
                :show_text="true"
                :show_option="true" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" md="4" class="pa-2">
          <v-row>
            <v-col>
              <Grid v-if="images[3]" 
                :title="images[3].alt"
                :image="images[3].src" 
                :isSquare="true" 
                :show_text="true"
                :show_option="true" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <Grid v-if="images[4]" 
                :title="images[4].alt"
                :image="images[4].src" 
                :isSquare="true" 
                :show_text="true"
                :show_option="true" />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-responsive aspect-ratio="3" style="width: 100%;" class="pa-0">
            <v-row style="height: 100%;">
              <v-col cols="6" md="4" style="height: 100%;" class="pa-2">
                <Grid v-if="images[5]" 
                  :title="images[5].alt"
                  :image="images[5].src" 
                  :isSquare="false"
                  :show_text="true" 
                  :show_option="true" />
              </v-col>
              <v-col cols="6" md="8" style="height: 100%;" class="pa-2">
                <Grid v-if="images[0]" 
                  :title="images[0].alt"
                  :image="images[0].src" 
                  :isSquare="false"
                  :show_text="true" 
                  :show_option="true" />
              </v-col>
            </v-row>
          </v-responsive>
        </v-col>

      </v-row>
    </div>

    <!-- MOBILE VIEW -->
    <v-row class="d-sm-none">
      <template v-for="(image, i) in images" :key="i">
        <v-col cols="6">
          <Grid 
            :title="image.alt" 
            :image="image.src"
            :isSquare="true" 
            :show_text="true" 
            :show_option="true" />
        </v-col>
      </template>
    </v-row>

    
  </div>
  <v-row>
      <v-col class="text-center mt-4">
        <v-btn color="warning" size="large" class="text-white px-8" rounded="pill">
          VIEW ALL COUNTRY SELECTIONS
        </v-btn>
      </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, watch, onUnmounted, onBeforeUnmount } from 'vue';
import whisky from "@/assets/images/boozards/drink2.jpg"
import whisky3 from "@/assets/images/boozards/drink3.jpg";
import drink from "@/assets/images/boozards/drinnk.jpg";

import { eventBus } from "@/util/bus";
import Grid from './DesktopView/Happening/partials/grid.vue';



const filter = ref('View All');

// Images array remains the same
const images = [
  {
    src: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    alt: 'Kingfisher Beer'
  },
  {
    src: whisky,
    alt: 'Japanese Whisky'
  },
  {
    src: whisky3,
    alt: 'Makers Mark'
  },
  {
    src: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=2067&auto=format&fit=crop',
    alt: 'Champagne'
  },
  {
    src: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1887&auto=format&fit=crop',
    alt: 'Vodka Bottles'
  },
  {
    src: drink,
    alt: 'Guinness'
  }
]

const isSmall = computed(() => {
  return window.innerWidth < 640
});

const handleTrendingChange = (title: string) => {
  filter.value = title;
  
  const trendingGridContainer = document.getElementById('trending-grid-container');
  if (trendingGridContainer) {
    const offset = 150;
    const elementPosition = trendingGridContainer.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}
</script>

<style scoped>
 .orange-underline {
    width: 80px;
    height: 3px;
    background-color: #FF9800;
    margin: 0 auto;
  }
  
#scroll-trending {
  overflow-x: auto;
  overflow-x: auto;
  scrollbar-width: none;
  /* For Firefox */
  -ms-overflow-style: none;
}
</style>
