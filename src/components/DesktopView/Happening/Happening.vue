<template>
  <div id="trending-grid-container">

    <v-row justify="center">
      <v-col cols="12">
        <p class="text-center my-6 text-h5 text-sm-h4 text-lg-h3" style="font-family: 'DM Serif Display', system-ui;
        font-weight: 400;">
          Country Selections
        </p>
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

    <!-- FILTER LIST -->
    <div class="d-sm-none" id="trending-filter-container">
      <div id="trending-item" class="d-flex ga-2 py-3 w-100 px-2">
        <div class="flex-fill d-flex ga-2" id="scroll-trending">
          <template v-for="(item, index) in filterList" :key="index">
            <v-btn @click="handleTrendingChange(item)" class="bg-white rounded-pill border-thin" elevation="0">
              {{ item }}
            </v-btn>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, watch, onUnmounted, onBeforeUnmount } from 'vue';
import whisky from "@/assets/images/boozards/drink2.jpg"
import whisky3 from "@/assets/images/boozards/drink3.jpg";
import drink from "@/assets/images/boozards/drinnk.jpg";

import { eventBus } from "@/util/bus";
import Grid from './partials/grid.vue';

interface TrendingItem {
  category_id: number;
  active: string;
  category_name: string;
  dated: string;
  description: string;
  long_image: string;
  main_image: string | null;
  user_id: number;
}


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

const props = defineProps<{
  data: TrendingItem[];
}>();

const filter = ref('View All');

const filterTrendings = computed(() => {
  if (filter.value == 'View All') { return props.data; }

  return props.data.filter((t) => {
    return t.category_name === filter.value;
  });
});

const filterList = computed(() => {
  let list: string[] = [
    'View All'
  ];

  props.data.forEach((item) => {
    if (!list.includes(item.category_name)) {
      list.push(item.category_name);
    }
  });

  return list;
});

const handleTrendingChange = (title: string) => {
  filter.value = title;
  // show(title);

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
const handleDataChange = () => {
  const tcontainer = document.getElementById('trending-container');
  const titem = document.getElementById('trending-item');

  if (tcontainer && titem) {
    tcontainer.appendChild(titem);
  }
};

onMounted(() => {
  handleDataChange();
});

onBeforeUnmount(() => {
  const container = document.getElementById('trending-filter-container');
  const titem = document.getElementById('trending-item');

  if (container && titem) {
    container.appendChild(titem);
  }
});

</script>

<style scoped>
#scroll-trending {
  overflow-x: auto;
  overflow-x: auto;
  scrollbar-width: none;
  /* For Firefox */
  -ms-overflow-style: none;
}
</style>
