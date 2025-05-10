<template>
  <router-link to="/">
    <v-img
      :src="$fileURL + logo"
      height="50"
      width="100"
      transition="fade-transition"
    >
      <template #placeholder>
        <div class="skeleton" />
      </template>
    </v-img>
  </router-link>
</template>

<script setup lang="ts">
import { appId, fileURL } from "@/util/variables";
import axios from "@/util/axios";
import { ref } from "vue";
const logo = ref(null);
const getLogo = () => {
  axios
    .get(`/app/logo/${appId}`)
    .then((response) => {
      const data = response.data.data;
      // console.log("data logo")
      // console.log(data)
      logo.value = data;
    })
    .catch((error) => {
      console.log(error);
    });
};
getLogo();
</script>
