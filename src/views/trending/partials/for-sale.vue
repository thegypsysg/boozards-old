<template>
  <div class="my-10 mx-auto" style="max-width: 1200px">
    <div class="d-flex gap-2 justify-center ga-3 mt-12">
      <span class="mdi mdi-office-building-outline"></span>
      <span>EXCLUSIVE PORTFOLIO</span>
    </div>
    <div class="featured-title text-h4 text-md-h3 text-center mt-6">
      EXPLORE OUR RANGE OF PREMIUM PROPERTIES
    </div>

    <div class="featured-sub-title text-center text-grey-darken-1 mt-6">
      OUR PORTFOLIO INCLIDES HIGH-QUALITY VILLAS, SPACIOUS APARTMENTS, AND
      THOUGHTFUL DESIGNED TOWNHOUSES
    </div>

    <div class="d-flex flex-column flex-md-row ga-10 justify-center mt-10">
      <template v-for="(p, i) in portfolios" :key="i">
        <v-btn class="font-weight-bold"
          >{{ p.name }} (<span class="text-red">{{ p.count }}</span
          >)</v-btn
        >
      </template>
    </div>

    <div class="w-100 d-flex justify-center mt-6">
      <v-btn class="bg-black">
        View More
        <v-icon right class="ml-4">mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
  <div v-for="(item, j) in sale_items" :key="j">
    <div class="d-flex justify-space-between align-center">
      <div class="text-md-h4 font-weight-bold">
        {{
          `${item.name} (${item.count}) in ${
            activeCity?.city_name
              ? activeCity?.city_name
              : activeCity?.country_name
          } for Sale`
        }}
      </div>
      <div class="text-cyan-darken-2">View All</div>
    </div>

    <Carousel v-bind="settings" :breakpoints>
      <Slide v-for="(img, i) in item.items" :key="i">
        <router-link to="/buy/studio">
          <v-hover v-slot:default="{ isHovering, props }">
            <v-responsive class="rounded pa-2">
              <v-img
                :src="$fileURL + img.url"
                cover
                aspect-ratio="1.3"
                style="height: 100%"
              >
                <div
                  v-bind="props"
                  :style="[
                    isHovering
                      ? 'background-color: rgba(0, 0, 0, 0.0)'
                      : 'background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%)',
                    'transition: background-color 0.3s ease',
                  ]"
                  class="fill-height px-4 py-4 text-white font-weight-light"
                >
                  <div class="d-flex flex-column justify-end fill-height">
                    <div class="d-flex flex-column justify-start ga-1 w-100">
                      <v-badge
                        color="black"
                        :content="img.button"
                        inline
                        rounded="0"
                        class="custom-badge"
                        align="left"
                      />
                      <div class="text-md-h6 font-weight-bold text-left">
                        {{ img.price }}
                      </div>
                      <div
                        class="d-flex flex-column flex-md-row justify-space-between ga-3"
                      >
                        <div class="d-flex flex-column flex-md-row ga-md-3">
                          <div class="d-flex ga-3">
                            <div class="d-flex ga-1 align-center">
                              <v-icon icon="mdi-bed-king-outline" />
                              <div
                                class="font-weight-medium text-caption text-md-body-2"
                              >
                                {{ img.facility.bed }}
                              </div>
                            </div>
                            <div class="d-flex ga-1 align-center">
                              <v-icon icon="mdi-shower-head" />
                              <div
                                class="font-weight-medium text-caption text-md-body-2"
                              >
                                {{ img.facility.shower }}
                              </div>
                            </div>
                          </div>
                          <div class="d-flex ga-3">
                            <div class="d-flex ga-1 align-center">
                              <v-icon icon="mdi-car-back" />
                              <div
                                class="font-weight-medium text-caption text-md-body-2"
                              >
                                {{ img.facility.car_park }}
                              </div>
                            </div>
                            <div class="d-flex ga-1 align-center">
                              <v-icon icon="mdi-ruler-square" />
                              <div
                                class="font-weight-medium text-caption text-md-body-2"
                              >
                                {{ img.facility.area }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="d-none d-md-flex ga-1">
                          <v-btn
                            density="compact"
                            icon="mdi-arrow-expand"
                            color="black"
                            class="btn-opacity rounded"
                          />
                          <v-btn
                            density="compact"
                            icon="mdi-heart-outline"
                            color="black"
                            class="btn-opacity rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-img>
            </v-responsive>
          </v-hover>
        </router-link>
      </Slide>

      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
  </div>
</template>

<script setup>
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { computed, onMounted, ref, watchEffect } from "vue";
import axios from "@/util/axios";
import { useStore } from "vuex";

const store = useStore();

const selectedItem = ref();
const sale_items = ref([]);
const portfolios = ref([]);

const settings = ref({
  itemsToShow: 1,
  snapAlign: "center",
});
const breakpoints = ref({
  // 200px and up
  200: {
    itemsToShow: 1.5,
    snapAlign: "center",
  },
  // 640px and up
  640: {
    itemsToShow: 2.5,
    snapAlign: "center",
  },
  // 700px and up
  700: {
    itemsToShow: 3.5,
    snapAlign: "center",
  },
});

const activeCity = computed(() => store.state.activeCity);

const getPortfolios = () => {
  axios
    .get(
      activeCity.value?.city_id
        ? `/list-property-types-with-property-count/${activeCity.value?.country_id ? activeCity.value?.country_id : null}/${activeCity.value?.city_id ? activeCity.value?.city_id : null}`
        : `/list-property-types-with-property-count/${activeCity.value?.country_id ? activeCity.value?.country_id : null}`,
    )
    .then(async (response) => {
      const data = response.data.data;
      portfolios.value = data.map((i) => {
        return {
          ...i,
          id: i.property_type_id,
          name: i.property_name,
          count: i.property_count,
        };
      });
      sale_items.value = data.map((i) => {
        return {
          ...i,
          id: i.property_type_id,
          name: i.property_name,
          count: i.property_count,
          items: [],
        };
      });

      // Memanggil API untuk setiap ID di portfolios
      await fetchItemsForPortfolios();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const fetchItemsForPortfolios = async () => {
  try {
    // Menggunakan Promise.all untuk menjalankan request API secara paralel
    const promises = sale_items.value.map((sale) => {
      return axios
        .get(
          activeCity.value?.city_id
            ? `/list-properties-by-property-type/${sale.id}/${activeCity.value?.country_id ? activeCity.value?.country_id : null}/${activeCity.value?.city_id ? activeCity.value?.city_id : null}`
            : `/list-properties-by-property-type/${sale.id}/${activeCity.value?.country_id ? activeCity.value?.country_id : null}`,
        )
        .then((response) => {
          const data = response.data.data;
          sale.items = data.map((item) => {
            return {
              ...item,
              url: item?.main_image,
              featured: item?.featured == "Y" ? true : false,
              price: "$4,500/mo",
              button: item?.button_name,
              facility: {
                bed: item?.bedrooms,
                shower: item?.bathrooms,
                car_park: item?.car_park,
                area: item?.area + " Sq Ft",
              },
            };
          });
        });
    });

    // Menunggu semua request selesai
    await Promise.all(promises);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// const portfolios = [
//   {
//     name: "Studio",
//     count: 3,
//   },
// ];

// const sale_items = [
//   "Studio (8) in Batam for Sale",
//   "Penthouse (3) in Batam for Sale",
//   "Cond (2) in Batam",
// ];

// const items = [
//   {
//     url: img12,
//     featured: true,
//     price: "$4,500/mo",
//     facility: {
//       bed: 4,
//       shower: 2,
//       car_park: 1,
//       area: "1200 Sq Ft",
//     },
//   },
// ];

watchEffect(() => {
  getPortfolios();
});

onMounted(() => {
  getPortfolios();
});
</script>

<style scoped>
.custom-badge {
  opacity: 0.6;
}

.btn-opacity {
  opacity: 0.4;
}
</style>
