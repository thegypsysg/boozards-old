<template>
  <div style="
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 0;
    ">
    <!-- Gambar background -->
    <v-img :src="img" aspect-ratio="16/9" cover :class="['zoom-effect', { zoomed: isZoomed }]"
      style="height: 100%; z-index: 0; position: relative"></v-img>

    <!-- Overlay abu-abu dengan opacity -->
    <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
      "></div>

    <!-- Teks dan tombol di atas banner -->
    <v-row style="
        z-index: 2;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100vh;
        margin-left: 10px;
        margin-top: 70px;
      " class="d-flex align-center">
      <v-col cols="12" class="d-flex flex-column align-start" style="padding-left: 20px">
        <div class="text-h4 text-sm-h2 font-weight-bold text-white">
          Are you looking to<br />invest in Batam
        </div>
        <v-btn @click="scrollToSection"
          class="text-white v-btn v-btn--has-bg theme--light elevation-0 v-size--default mt-2"
          style="background-color: #fa2964">
          View Options
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import img from '@/assets/images/batam-view.jpeg'

</script>

<style scoped></style>
