<template>
  <div>
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-center my-6 text-h5 text-sm-h4 text-lg-h3" style="font-family: 'DM Serif Display', system-ui;
        font-weight: 400;">Our Brands</h1>
        <div class="orange-underline mb-4"></div>
        <p class="text-subtitle-1 mb-8">Discover all the leading brands from all over.</p>
      </v-col>
    </v-row>

    <v-row justify="center" class="my-6">
      <transition-group name="card-transition" mode="out-in">
        <template v-for="brand in brands" :key="brand.id">
          <v-col cols="12" md="4">
            <v-hover v-slot:default="{ isHovering, props }">
              <v-responsive class="rounded">
                <v-img :src="brand.image" cover style="height: 100%" aspect-ratio="0.75">
                  <div v-bind="props" :style="[
                    isHovering
                      ? 'background-color: rgba(0, 0, 0, 0.0)'
                      : 'background-color: rgba(0, 0, 0, 0.3)',
                    'transition: background-color 0.3s ease',
                  ]" class="fill-height px-8 py-8 text-white font-weight-light">
                    <div class="d-flex flex-column justify-end fill-height">
                      <div class="d-flex flex-column flex-md-row justify-space-between align-center ga-3">
                        <div class="font-weight-light text-center text-md-left">
                          <div>{{ brand.category }}</div>
                          <div class="text-h4 font-weight-bold text-white">
                            {{ brand.name }}
                          </div>
                        </div>
                        <v-btn color="red-darken-2" :to="brand.url" router-link>VIEW</v-btn>
                      </div>
                    </div>
                  </div>
                </v-img>
              </v-responsive>
            </v-hover>
          </v-col>
        </template>
      </transition-group>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import whisky from "@/assets/images/boozards/drink2.jpg";
import whisky3 from "@/assets/images/boozards/drink3.jpg";
import drink from "@/assets/images/boozards/drinnk.jpg";

const brands = ref([
  {
    id: 1,
    name: 'Monkey Shoulders',
    category: 'Premium Whiskey',
    image: whisky,
    url: '/brand/monkey-shoulders'
  },
  {
    id: 2,
    name: 'Johnnie Walker',
    category: 'Scotch Whisky',
    image: whisky3,
    url: '/brand/johnnie-walker'
  },
  {
    id: 3,
    name: 'Chivas Regal',
    category: 'Blended Scotch',
    image: drink,
    url: '/brand/chivas-regal'
  },
  {
    id: 4,
    name: 'Jameson',
    category: 'Irish Whiskey',
    image: whisky,
    url: '/brand/jameson'
  },
  {
    id: 5,
    name: 'Ballentines',
    category: 'Blended Scotch',
    image: whisky3,
    url: '/brand/ballentines'
  }
]);
</script>

<style>
.orange-underline {
  width: 80px;
  height: 3px;
  background-color: #FF9800;
  margin: 0 auto;
}

.page-opacity-enter-active,
.page-opacity-leave-active {
  transition: 400ms ease all;
}

.page-opacity-enter-from,
.page-opacity-leave-to {
  opacity: 0;
}

.ga-3 {
  gap: 12px;
}
</style>
