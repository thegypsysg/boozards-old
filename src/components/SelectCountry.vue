<template>
  <div id="trending-grid-container mt-md-10 mt-sm-2">
    <v-row justify="center">
      <v-col cols="12">
        <p
          class="text-center my-6 text-h5 text-sm-h4 text-lg-h3"
          style="
            font-family:
              DM Serif Display,
              system-ui;
            font-weight: 400;
          "
        >
          Country Selections
        </p>
        <div class="orange-underline mb-4"></div>
      </v-col>
    </v-row>

    <!-- DESKTOP VIEW -->
    <div v-if="!isLoading" class="d-none d-sm-block w-100">
      <v-row>
        <v-col cols="6" md="4" class="d-flex flex-column pa-2">
          <Grid
            v-if="imagesDataDesktop[0]?.image"
            :title="imagesDataDesktop[0]?.nationality + ' Booze'"
            :image="fileURL + imagesDataDesktop[0]?.image"
            :isSquare="false"
            :show_text="true"
            :show_option="true"
          />
        </v-col>

        <v-col cols="6" md="4" class="pa-2">
          <v-row>
            <v-col>
              <Grid
                v-if="imagesDataDesktop[1]?.image"
                :title="imagesDataDesktop[1]?.nationality + ' Booze'"
                :image="fileURL + imagesDataDesktop[1]?.image"
                :isSquare="true"
                :show_text="true"
                :show_option="true"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <Grid
                v-if="imagesDataDesktop[2]?.image"
                :title="imagesDataDesktop[2]?.nationality + ' Booze'"
                :image="fileURL + imagesDataDesktop[2]?.image"
                :isSquare="true"
                :show_text="true"
                :show_option="true"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" md="4" class="pa-2">
          <v-row>
            <v-col>
              <Grid
                v-if="imagesDataDesktop[3]?.image"
                :title="imagesDataDesktop[3]?.nationality + ' Booze'"
                :image="fileURL + imagesDataDesktop[3]?.image"
                :isSquare="true"
                :show_text="true"
                :show_option="true"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <Grid
                v-if="imagesDataDesktop[4]?.image"
                :title="imagesDataDesktop[4]?.nationality + ' Booze'"
                :image="fileURL + imagesDataDesktop[4]?.image"
                :isSquare="true"
                :show_text="true"
                :show_option="true"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-responsive aspect-ratio="3" style="width: 100%" class="pa-0">
            <v-row style="height: 100%">
              <v-col cols="6" md="4" style="height: 100%" class="pa-2">
                <Grid
                  v-if="imagesDataDesktop[5]?.image"
                  :title="imagesDataDesktop[5]?.nationality + ' Booze'"
                  :image="fileURL + imagesDataDesktop[5]?.image"
                  :isSquare="false"
                  :show_text="true"
                  :show_option="true"
                />
              </v-col>
              <v-col cols="6" md="8" style="height: 100%" class="pa-2">
                <Grid
                  v-if="imagesDataDesktop[6]?.image"
                  :title="imagesDataDesktop[6]?.nationality + ' Booze'"
                  :image="fileURL + imagesDataDesktop[6]?.image"
                  :isSquare="false"
                  :show_text="true"
                  :show_option="true"
                />
              </v-col>
            </v-row>
          </v-responsive>
        </v-col>
      </v-row>
    </div>

    <!-- MOBILE VIEW -->
    <v-row v-if="!isLoading" class="d-sm-none">
      <template v-for="(image, i) in imagesDataMobile" :key="image.brand_id">
        <v-col cols="6">
          <Grid
            v-if="image?.image"
            :title="image?.nationality + ' Booze'"
            :image="fileURL + image?.image"
            :isSquare="true"
            :show_text="true"
            :show_option="true"
          />
        </v-col>
      </template>
    </v-row>
  </div>
  <v-row>
    <v-col class="text-center mt-4">
      <v-btn
        color="warning"
        size="large"
        class="text-white px-8"
        rounded="pill"
        @click="showDialog"
      >
        VIEW ALL COUNTRY SELECTIONS
      </v-btn>
    </v-col>
  </v-row>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "@/util/axios";
import { fileURL } from "@/main";
import Grid from "./DesktopView/Happening/partials/grid.vue";
import whisky from "@/assets/images/boozards/drink2.jpg";
import whisky3 from "@/assets/images/boozards/drink3.jpg";
import drink from "@/assets/images/boozards/drinnk.jpg";
import { useStore } from "vuex";

const store = useStore();

const imagesDataDesktop = ref([]);
const imagesDataMobile = ref([]);
const isLoading = ref(true);

// Images array remains the same
const images = [
  {
    src: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    alt: "Kingfisher Beer",
  },
  {
    src: whisky,
    alt: "Japanese Whisky",
  },
  {
    src: whisky3,
    alt: "Makers Mark",
  },
  {
    src: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=2067&auto=format&fit=crop",
    alt: "Champagne",
  },
  {
    src: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1887&auto=format&fit=crop",
    alt: "Vodka Bottles",
  },
  {
    src: drink,
    alt: "Guinness",
  },
];

const showDialog = () => {
  store.commit("setIsCountryUpdating", true);
};

function getImagesDataDesktop() {
  isLoading.value = true;
  axios
    .get(`/country-selection-brands/7`)
    .then((response) => {
      const data = response.data.data;
      // console.log(data);
      imagesDataDesktop.value = data;
    })
    .catch((error) => {
      // eslint-disable-next-line

      throw error;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function getImagesDataMobile() {
  isLoading.value = true;
  axios
    .get(`/country-selection-brands/6`)
    .then((response) => {
      const data = response.data.data;
      // console.log(data);
      imagesDataMobile.value = data;
    })
    .catch((error) => {
      // eslint-disable-next-line

      throw error;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

onMounted(() => {
  getImagesDataDesktop();
  getImagesDataMobile();
});
</script>

<style scoped>
.orange-underline {
  width: 80px;
  height: 3px;
  background-color: #ff9800;
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
