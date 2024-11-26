<template>
  <div id="ourBrands" class="mt-md-10 mt-sm-2">
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
        <template v-for="img in imagesArray" :key="img.id">
          <v-col cols="12" md="4">
            <v-hover v-slot:default="{ isHovering, props }">
              <v-responsive class="rounded">
                <v-img :src="img.image" cover style="height: 100%" aspect-ratio="0.75">
                  <!-- class="fade-in-up" this code is error when run fade-in-up class animation -->
                  <div v-bind="props" :style="[
                    isHovering
                      ? 'background-color: rgba(0, 0, 0, 0.0)'
                      : 'background-color: rgba(0, 0, 0, 0.3)',
                    'transition: background-color 0.3s ease',
                  ]" class="fill-height px-8 py-8 text-white font-weight-light">
                    <div class="d-flex flex-column justify-end fill-height">
                      <div class="d-flex flex-column flex-md-row justify-space-between align-center ga-3">
                        <div class="font-weight-light text-center text-md-left">
                          <!-- <div>{{ img.properties_count }} Properties</div> -->
                          <div class="text-h4 font-weight-bold text-white">
                            {{ img.title }}
                          </div>
                        </div>
                        <v-btn color="red-darken-2" router-link>VIEW</v-btn>
                        <!-- <v-btn color="red-darken-2" :to="img.url" router-link>VIEW</v-btn> -->
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
import { onMounted, ref } from "vue";
import { appId, fileURL } from "@/util/variables";
import axios from "@/util/axios";

const listData = ref([
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    title: "Monkey Shoulders",
    properties_count: 14,
    url: '/brand-1'
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    title: "Roku Gin",
    properties_count: 14,
    url: '/brand-2'
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    title: "Tiger Beet",
    properties_count: 14,
    url: '/brand-3'
  }
]);

const imagesArray =[
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    title: "Monkey Shoulders",
    properties_count: 14,
    url: '/brand-1'
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    title: "Roku Gin",
    properties_count: 14,
    url: '/brand-2'
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    title: "Tiger Beet",
    properties_count: 14,
    url: '/brand-3'
  }
]
const isLoading = ref(true);

function get4WallsLocationData() {
  isLoading.value = true;
  axios
    .get(`/list-app-cities-by-app/${appId}`)
    .then((response) => {
      const data = response.data.data;
      //   console.log(data);
      listData.value = data
        .sort(function (a, b) {
          return a.city_id - b.city_id;
        })
        .map((item) => {
          return {
            ...item,
            id: item.city_id,
            title: item.city_name,
            image: item.web_long_image
              ? fileURL + item.web_long_image
              : "",
            properties_count: 14,
            url: '/batam-properties'
          };
        });
      // let itemFinal = [];
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
      throw error;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

onMounted(() => {
  get4WallsLocationData();
});
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
</style>
