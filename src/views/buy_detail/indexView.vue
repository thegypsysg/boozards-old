<template>
  <!-- Desktop Header -->
  <div
    class="d-none d-md-flex justify-space-between align-center py-4 px-10 border-b"
    style="min-height: 90px"
  >
    <!-- <div class="drawer-logo" v-if="logo">
      <v-img height="35" width="80" :src="$fileURL + logo" />
    </div> -->
    <div class="d-flex align-center ga-4">
      <Logo />
      <div class="text-h5 font-weight-bold">Marcs Boulevard</div>
    </div>

    <div
      v-if="!isSignin"
      style="height: 48px; width: 48px; border-radius: 50%; cursor: pointer"
      icon
      class="mr-4"
      @click="drawer = !drawer"
    >
      <v-img
        v-if="userImage != null"
        :src="userImage"
        cover
        style="height: 100%; width: 100%; border-radius: 50%"
      >
        <template #placeholder>
          <div class="skeleton" />
        </template>
      </v-img>
      <img
        v-else-if="userImage == null && !isLoading"
        src="@/assets/images/icons/user_icon.png"
        cover
        height="48"
        style="height: 100%; width: 100%"
      />
    </div>
  </div>

  <div
    id="studio-container"
    style="
      min-height: 100vh;
      position: relative;
      z-index: 2;
      background-color: #f7f8f9;
      overflow-x: hidden;
    "
  >
    <!-- Desktop -->
    <v-container style="height: 70vh" class="pa-0 d-none d-md-block">
      <Grid
        :show_title="true"
        :title="detailData?.project_header"
        :image="$fileURL + detailData?.main_image"
        :isSquare="false"
      />
    </v-container>

    <!-- MOBILE -->
    <v-container class="d-md-none pa-0" style="position: relative">
      <v-row style="height: 34vh">
        <v-col cols="12" class="d-flex flex-column">
          <Grid
            :title="detailData?.project_header"
            :image="$fileURL + detailData?.main_image"
            :isSquare="false"
          />
          <v-badge
            v-if="detailData?.under_construction == 'Y'"
            content="UNDER CONSTRUCTION"
            inline
            color="blue-darken-4"
            rounded="0"
            class="text-body-1 font-weight-bold position-absolute"
            style="top: 30px; left: 20px"
          ></v-badge>
        </v-col>
      </v-row>

      <v-container>
        <div class="text-body-1 font-weight-black">
          {{ detailData?.project_header }}
        </div>
        <div class="text-h4 font-weight-bold mt-8">
          {{ detailData?.project_name }}
        </div>
        <div class="text-body-2 font-weight-black text-red-darken-4 my-4">
          By
        </div>
        <div class="d-flex ga-2 align-center justify-start">
          <img :src="$fileURL + detailData?.logo" style="height: 30px" />
          <div class="font-weight-bold text-body-1">
            {{ detailData?.partner_name }}
          </div>
        </div>

        <div class="d-flex justify-space-between mt-6">
          <div class="d-flex ga-2">
            <v-btn
              rounded="0"
              size="small"
              icon="mdi-newspaper-variant-outline"
            ></v-btn>
            <v-btn rounded="0" size="small" icon="mdi-map-legend"></v-btn>
            <v-btn
              rounded="0"
              size="small"
              icon="mdi-map-marker-radius-outline"
            ></v-btn>
          </div>
          <div class="d-flex ga-2">
            <v-btn rounded="0" size="small" icon="mdi-heart-outline"></v-btn>
            <v-btn
              rounded="0"
              size="small"
              icon="mdi-share-variant-outline"
            ></v-btn>
          </div>
        </div>
      </v-container>
    </v-container>

    <v-container
      class="d-md-none d-block position-fixed bottom-0 bg-white border-t"
      style="z-index: 10"
    >
      <div class="d-flex ga-2 align-center justify-space-between">
        <div class="d-flex ga-2 align-center">
          <v-avatar color="grey" size="50" style="border-radius: 5px">
            <v-img :src="$fileURL + detailDev?.agent_main_image" cover></v-img>
          </v-avatar>
          <div class="text-subtitle-1 font-weight-light">
            {{ detailDev?.agent_name }}
          </div>
        </div>
        <div class="d-flex ga-2">
          <v-btn
            color="#29a743"
            rounded="0"
            elevation="0"
            size="large"
            icon="mdi-chat-outline"
            class="rounded"
          >
            <a
              :href="`https://api.whatsapp.com/send?phone=${detailDev?.whats_app}&text=Hi there , I am interested in ${detailData?.project_name} by ${detailData?.partner_name}`"
            >
              <v-icon
                class="text-white"
                icon="mdi-chat-outline"
                size="24"
              ></v-icon>
            </a>
          </v-btn>
          <v-btn
            rounded="0"
            elevation="0"
            size="large"
            icon="mdi-phone-outline"
            class="rounded border"
            style="border-color: #29a743 !important"
          >
            <a :href="`tel://${detailDev?.mobile}`">
              <v-icon
                icon="mdi-phone-outline"
                size="24"
                style="color: #29a743 !important"
              ></v-icon>
            </a>
          </v-btn>
        </div>
      </div>
    </v-container>

    <About :desc="detailData?.project_description" />
    <!-- <Description class="mt-6 d-md-none d-block" /> -->
    <!-- <Overview class="mt-6 d-md-none d-block" /> -->
    <Detail
      :under_construction="detailCons?.under_construction"
      :main_image="detailCons?.main_image"
      :tag_line="detailCons?.tag_line"
      :completion_month="detailCons?.completion_month"
      :completion_year="detailCons?.completion_year"
      :construction_name="detailCons?.construction_name"
      :brief_details="detailCons?.brief_details"
      class="mt-6"
    />
    <Item :items="detailApart" class="mt-6" />
    <Video :video_link="detailDev?.video_link" class="mt-6" />
    <Contact
      :agent_main_image="detailDev?.agent_main_image"
      :agent_name="detailDev?.agent_name"
      :email="detailDev?.email"
      :mobile="detailDev?.mobile"
      :whats_app="detailDev?.whats_app"
      :project="detailData?.project_name"
      :partner="detailData?.partner_name"
      class="mt-6 d-none d-md-block"
    />

    <Footer />
  </div>
</template>

<script setup>
import Logo from "@/components/mainLogo.vue";
import Grid from "@/components/DesktopView/Happening/partials/grid.vue";
import Video from "./partials/video.vue";
import Contact from "./partials/contact.vue";
import Detail from "./partials/detail.vue";
import Item from "./partials/item.vue";
import About from "./partials/about.vue";

import { onMounted, ref } from "vue";
import axios from "@/util/axios";
import { useRoute } from "vue-router";

const route = useRoute();

const detailData = ref();
const detailCons = ref();
const detailApart = ref();
const detailDev = ref();

const getBuyDetail = () => {
  const buyId = route.params.id;
  axios
    .get(`/get-4walls-property-development-details/${buyId}`)
    .then((response) => {
      const data = response.data.data;
      // console.log(data);
      detailData.value = data;
      detailDev.value = data;
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
      throw error;
    });
};

const getBuyDetailConstruction = () => {
  const buyId = route.params.id;
  axios
    .get(`/get-first-4-walls-construction-by-development-id/${buyId}`)
    .then((response) => {
      const data = response.data.data;
      // console.log(data);
      detailCons.value = data;
      getBuyDetailApartment(data?.construction_id);
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
      throw error;
    });
};

const getBuyDetailApartment = (consId) => {
  axios
    .get(`/get-4-walls-construction-apartment-by-construction-id/${consId}`)
    .then((response) => {
      const data = response.data.data;
      // console.log(data);
      detailApart.value = data;
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
      throw error;
    });
};

onMounted(() => {
  getBuyDetail();
  getBuyDetailConstruction();
});
</script>
