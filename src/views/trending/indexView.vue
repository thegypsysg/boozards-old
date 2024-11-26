<template>
  <!-- <Banner /> -->

  <div
    id="trending-container"
    style="
      min-height: 100vh;
      position: relative;
      z-index: 2;
      background-color: #fff;
    "
  >
    <div
      class="d-none d-md-block mx-auto pt-16 pt-md-0 px-4 medium:px-20"
      style="max-width: 1200px; overflow-x: auto"
    >
      <div
        class="d-flex justify-center ga-6 my-5"
        style="min-width: fit-content"
      >
        <template v-if="loader">
          <v-skeleton-loader
            v-for="data in 7"
            :key="data"
            type="button"
            style="min-width: 100px; min-height: 90px"
          ></v-skeleton-loader>
        </template>

        <template v-else>
          <v-btn
            v-for="(n, index) in trendings"
            :key="index"
            @click="goToPath(n)"
            elevation="0"
            class="pa-2"
            style="min-width: 100px; min-height: 70px"
          >
            <div class="d-flex flex-column align-center ga-3 text-caption">
              <v-responsive>
                <v-img
                  :src="$fileURL + n.icon"
                  cover
                  style="height: 25px; width: 25px"
                  aspect-ratio="1"
                ></v-img>
              </v-responsive>
              {{ n.title }}
            </div>
          </v-btn>
        </template>
      </div>
    </div>

    <div v-if="loader" class="d-flex flex-column justify-center align-center">
      <v-skeleton-loader
        type="list-item"
        style="width: 550px"
      ></v-skeleton-loader>
      <v-skeleton-loader
        type="list-item"
        style="width: 450px"
      ></v-skeleton-loader>
    </div>
    <template v-else>
      <div
        class="d-md-block d-none text-center mt-6 mb-3 text-h4 text-md-h3 satisfy-regular"
      >
        {{ selectedItem?.tag_line }}
      </div>

      <div
        class="d-block d-md-none text-center mt-6 mb-3 text-h4 text-md-h3 satisfy-regular"
      >
        {{
          selectedTrending?.tag_line
            ? selectedTrending.tag_line
            : trendings[0]?.tag_line
        }}
      </div>

      <div class="text-center text-h4 font-weight-black">
        In

        <span class="text-red-darken-4">
          {{ activeCity?.city_name }}
        </span>
      </div>
    </template>

    <v-container class="mx-auto px-4" style="max-width: 1400px">
      <Slider />
    </v-container>
    <div class="mx-auto px-10 w-100">
      <FeaturedProject />
    </div>

    <v-container class="mx-auto px-4 medium:px-16" style="max-width: 1200px">
      <FeaturedMove />
      <Interested class="mt-10" />
      <!-- <Portfolio class="mt-10" /> -->
    </v-container>

    <v-container class="mx-auto px-4" style="max-width: 1400px">
      <ForSale />
    </v-container>

    <v-container class="mx-auto px-4 medium:px-16" style="max-width: 1200px">
      <Guide class="mt-10" />
    </v-container>
    <Footer />
  </div>
</template>

<script setup>
import "vue3-carousel/dist/carousel.css";

import Slider from "./partials/slider";
import FeaturedProject from "./partials/featured-project";
import FeaturedMove from "./partials/featured-move";
import Interested from "./partials/interested";
// import Portfolio from "./partials/portfolio";
import ForSale from "./partials/for-sale";
import Guide from "./partials/guide";
import { computed, onMounted, ref } from "vue";
import axios from "@/util/axios";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();

const router = useRouter();

const selectedItem = ref();
const trendings = ref([]);
const loader = ref(true);

const selectedTrending = computed(() => store.state.selectedTrending);
const activeCity = computed(() => store.state.activeCity);

const goToPath = (data) => {
  selectedItem.value = data;
  router.push(data.to);
};

const getTrendings = () => {
  loader.value = true;
  axios
    .get(`/list-main-categories`)
    .then((response) => {
      const data = response.data.data;
      trendings.value = data
        .sort((a, b) => a.category_id < b.category_id)
        .map((item) => ({
          ...item,
          icon: item.icon_image,
          title: item.category_name,
          to: item.link_name.includes("asdf")
            ? "/buy"
            : item.link_name.includes("roomates")
              ? "/roommates"
              : item.link_name.split("https://4walls.sg")[1],
        }));

      if (trendings.value.length > 0) {
        let getTagline = trendings.value.find(
          (item) => item.to === router.currentRoute.value.path,
        );

        if (getTagline) selectedItem.value = getTagline;
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      throw error;
    })
    .finally(() => {
      loader.value = false;
    });
};

onMounted(() => {
  getTrendings();
});
</script>

<style scoped>
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

.satisfy-regular {
  font-family: "Satisfy", cursive;
  font-weight: 400;
  font-style: normal;
}

#trending-container {
  margin-top: 105px;
}

@media (max-width: 959px) {
  #trending-container {
    margin-top: 320px;
  }
}
</style>
