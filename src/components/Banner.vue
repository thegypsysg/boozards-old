<template>
  <div
    class="bg-image"
    :style="{
      backgroundImage: `url(${$fileURL + appDetails?.app_main_image})`,
    }"
  >
    <div class="overlay"></div>
    <v-container
      style="
        height: calc(100vh - 90px);
        display: flex;
        align-items: center;
        position: relative;
        z-index: 100;
      "
    >
      <v-row>
        <v-col class="pt-16 pl-16" cols="12">
          <div
            class="hero__text pt-16"
            data-aos="fade-right"
            data-aos-offset="200"
            data-aos-duration="2000"
            data-aos-easing="ease-in-sine"
            style="z-index: 100"
          >
            <h2 style="color: #fff" class="w-lg-33 pr-lg-5">
              Explore Homes for Sale & Rent
            </h2>
            <!-- <h2 style="color: #fff">for Sale & Rent</h2> -->
            <!-- <router-link :to="{ hash: '#happeningTarget' }"> -->
            <v-btn
              @click="scrollToSection"
              class="btn-primary text-white v-btn v-btn--has-bg theme--light elevation-0 v-size--default mt-8"
              style="background-color: #fa2964"
            >
              <span>View Options</span>
            </v-btn>
            <!-- </router-link> -->
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { eventBus } from "@/util/bus";
import AOS from "aos";

function scrollToSection() {
  eventBus.scrollToSection = "happeningTarget"; // Ganti dengan ID section yang diinginkan
}

onMounted(() => {
  AOS.init();
});
</script>
<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Banner",
  props: ["appDetails"],
};
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  margin-top: 70px;
  min-height: calc(100vh - 70px);
  background: rgba(0, 0, 0, 0.5); /* Warna overlay dan transparansi */
  z-index: 1;
}
h1 {
  color: #ffec4b;
  font-size: 64px;
  font-weight: 700;
  text-transform: uppercase;
}
h2 {
  color: #fff;
  font-size: 40px;
  font-weight: 800;
}
@media (max-width: 959px) {
  h1 {
    font-size: 48px;
  }
  h2 {
    font-size: 43px;
  }
}
</style>
