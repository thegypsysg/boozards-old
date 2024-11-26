<script setup>
import axios from "@/util/axios";
import { useStore } from "vuex";
import { computed, onMounted, ref, watch } from "vue";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import { useRoute } from "vue-router";

const route = useRoute();

const settings = ref({
  itemsToShow: 1,
  snapAlign: "center",
  wrapAround: true,
});

const loader = ref(true);

const breakpoints = computed(() => {
  return {
    // 200px and up
    200: {
      itemsToShow: 1.5,
      snapAlign: "center",
    },
    // 640px and up
    640: {
      itemsToShow: 2,
      snapAlign: "center",
    },
    // 700px and up
    700: {
      itemsToShow: 3.5,
      snapAlign: "center",
    },
    // 1024 and up
    1024: {
      itemsToShow: 4.5,
      snapAlign: "start",
    },
    // 1280 and up
    1280: {
      itemsToShow: 5,
      snapAlign: "start",
    },
  };
});

const store = useStore();

const cities = ref([]);

const activeCity = computed(() => store.state.activeCity);

watch(activeCity, (value) => {
  getCities(value.city_id);
});

const getCities = async (cityId) => {
  loader.value = true;

  let link = `/towns/city/${cityId}`;
  try {
    const { data } = await axios.get(link);

    cities.value = data.data.map((item) => {
      return {
        ...item,
        city: item.town_name,
        img: item.town_image,
        properties: 2,
      };
    });
  } catch (error) {
    throw error;
  } finally {
    loader.value = false;
  }
};

onMounted(() => {
  getCities(activeCity.value?.city_id);
});
</script>

<template>
  <div>
    <div v-if="loader" class="d-flex ga-5 justify-center">
      <v-skeleton-loader
        v-for="data in 5"
        :key="data"
        :elevation="2"
        type="card"
        style="width: 200px; min-height: 90px"
      ></v-skeleton-loader>
    </div>
    <Carousel v-else v-bind="settings" :breakpoints>
      <Slide v-for="(city, i) in cities" :key="i">
        <v-responsive class="border pa-4 ma-6">
          <div>
            <v-img
              :src="$fileURL + city.img"
              aspect-ratio="1.3"
              :lazy-src="$fileURL + city.img"
              cover
              style="height: 100%"
            ></v-img>
            <div class="d-flex flex-column justify-center align-center">
              <div class="font-weight-bold">
                {{ city.city }}
              </div>
              <div>{{ city.properties }} properties</div>
            </div>
          </div>
        </v-responsive>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<style scoped></style>
