<template>
  <!-- <v-container> -->
  <!-- <div class="text-h5 font-weight-medium">Explore Our Booze</div>
    <p class="font-weight-light my-6">
      Choose from a diverse menu featuring a delectable array of booze. Our mission is to saitisfy your
      cravings and<br />
      elevate your drinking experience, one delicious drink at a time.
    </p> -->

  <ExploreOurMenuList :desktop="true" />
  <!-- </v-container> -->
</template>

<script lang="ts" setup>
import ExploreOurMenuList from "./explore-our-menu-list.vue";
</script>

<style></style>
