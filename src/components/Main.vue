<template>
  <div
    v-if="!userName"
    class="hero-container"
    :class="{ 'hero-container-mobile': isSmall }"
  >
    <!-- Background image -->
    <v-img
      :src="boozardsBackground"
      :class="['zoom-effect', { zoomed: isZoomed }]"
      class="hero-background"
      cover
    ></v-img>

    <!-- Overlay -->
    <div class="hero-overlay"></div>

    <!-- Hero content -->
    <v-container class="hero-content">
      <v-row align="center" justify="start">
        <v-col cols="12" md="8" lg="6">
          <div
            class="hero-text-container"
            :class="{ 'hero-text-mobile': isSmall }"
          >
            <div
              :data-aos="!isSmall ? 'fade-left' : 'fade-right'"
              data-aos-offset="200"
              data-aos-duration="2000"
              data-aos-easing="ease-in-sine"
            >
              <v-col
                cols="12"
                class="d-flex flex-column align-start"
                style="padding-left: 20px"
              >
                <h1
                  :style="{
                    color: '#fff',
                    fontSize: isSmall ? '30px' : '46px',
                    fontWeight: 'bold',
                  }"
                >
                  <span class="text-orange">Welcome !!!</span><br />
                  <span class="text-white">What's your brand ?</span>
                </h1>

                <v-btn
                  color="orange"
                  size="large"
                  class="text-uppercase text-white mt-4"
                  to="/price-list"
                >
                  View Price List
                </v-btn>
              </v-col>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <div
    class="main-content"
    :class="userName ? 'main-content-user' : 'main-content-guest'"
  >
    <ExploreOurMenu class="d-none d-md-block" />
    <FilterMenu v-if="!isLoading" :price-items="productPrice" />
    <YourOrder v-if="userName" class="mb-4" />
    <div v-if="!isLoading" id="ourBooze" class="mx-auto px-2 px-md-10">
      <!-- style="max-width: 1200px" -->
      <template v-for="item in productCategories" :key="item?.category_id">
        <Whisky
          v-if="item?.products.length > 0"
          :title="item?.category_name"
          :products="item?.products"
          :countries="item?.countries"
        />
      </template>
      <template v-if="productGift?.products.length > 0">
        <Edition
          :title="'Gift Items'"
          :products="productGift?.products"
          :countries="productGift?.country_list"
          :categories="productGift?.category_list"
        />
      </template>
      <template v-if="productLimited?.products.length > 0">
        <Edition
          :title="'Limited Edition'"
          :products="productLimited?.products"
          :countries="productLimited?.country_list"
          :categories="productLimited?.category_list"
        />
      </template>
      <template v-if="productSpecial?.products.length > 0">
        <Edition
          :title="'Special Edition'"
          :products="productSpecial?.products"
          :countries="productSpecial?.country_list"
          :categories="productSpecial?.category_list"
        />
      </template>
      <template v-if="productMiniatures?.products.length > 0">
        <Edition
          :title="'Miniatures'"
          :products="productMiniatures?.products"
          :countries="productMiniatures?.country_list"
          :categories="productMiniatures?.category_list"
        />
      </template>
      <v-row class="mt-8">
        <v-col cols="12">
          <p class="font-weight-black text-h5">
            <span class="text-orange">Premium Booze </span>
          </p>
        </v-col>
      </v-row>
      <template v-for="(item, index) in productPrice" :key="index">
        <Premium
          v-if="item?.products.length > 0"
          :title="item?.display_price_range"
          :products="item?.products"
          :countries="item?.country_list"
          :categories="item?.category_list"
        />
      </template>
      <HappyHour />
      <SelectCountry />
      <!-- <OurBrands /> -->
      <Partners />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"; // Ensure these are imported
import { appId } from "../main";
import { eventBus } from "@/util/bus";
import axios from "@/util/axios";
import AOS from "aos";
import boozardsBackground from "@/assets/images/boozards/boozard-whiskycc.jpg";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const isZoomed = ref(false);
const listData = ref([]);
const listDataCommercial = ref([]);
const listMainCategories = ref([]);
const productCategories = ref([]);
const productPrice = ref([]);
const productGift = ref(null);
const productLimited = ref(null);
const productSpecial = ref(null);
const productMiniatures = ref(null);
const isLoading = ref(true);

const props = defineProps({
  isSmall: {
    type: Boolean,
    default: false,
  },
});

function scrollToSection() {
  eventBus.scrollToSection = "happeningTarget"; // Ganti dengan ID section yang diinginkan
}

const selectedCountry = computed(() => store.state.selectedCountry);
const userName = computed(() => {
  return store.state.userName;
});

const handleIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
};

function get4WallsPropertyData() {
  isLoading.value = true;
  axios
    .get(`/list-4walls-property-types`)
    .then((response) => {
      const data = response.data.data;
      //   console.log(data);
      listData.value = data.sort(function (a, b) {
        return a.property_type_id - b.property_type_id;
      });
      // let itemFinal = [];
    })
    .catch((error) => {
      // eslint-disable-next-line

      throw error;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function get4WallsPropertyDataCommercial() {
  isLoading.value = true;
  axios
    .get(`/list-4walls-property-types?property_category=C`)
    .then((response) => {
      listDataCommercial.value = response.data.data;
    })
    .catch((error) => {
      // eslint-disable-next-line

      throw error;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

const getListMainCategories = async () => {
  isLoading.value = true;
  const response = await axios.get("/list-main-categories");
  listMainCategories.value = response.data.data;
  isLoading.value = false;
};

const getProductCategoryListData = async (cityId) => {
  isLoading.value = true;
  try {
    const response = await axios.get(
      `/categories-with-products/app/${appId}/${cityId}`,
    );
    const data = response.data.data;

    productCategories.value = data
      .sort((a, b) => a.category_id - b.category_id)
      .map((category) => ({
        category_id: category.category_id,
        category_name: category.category_name,
        countries: category.countries,
        products: category.brands.flatMap((brand) =>
          brand.products.map((product) => ({
            ...product,
            brand_id: brand.brand_id,
            brand_name: brand.brand_name,
            category_id: category.category_id,
            country_id: brand.country_id,
            country_name: brand.country.country_name,
            //isCount: false,
            //count: 1,
          })),
        ),
      }));

    // console.log("Transformed Data:", productCategories.value);
  } catch (error) {
    console.error("Error fetching product categories:", error);
  } finally {
    isLoading.value = false;
  }
};

const getProductPriceRangeData = async (cityId) => {
  isLoading.value = true;
  try {
    const response = await axios.get(
      `/products-by-price-range/app/${appId}/${cityId}`,
    );
    const data = response.data.data;

    productPrice.value = data;

    // console.log("Transformed Data:", productCategories.value);
  } catch (error) {
    console.error("Error fetching product price price:", error);
  } finally {
    isLoading.value = false;
  }
};

const getProductEditionData = async (type, cityId) => {
  isLoading.value = true;
  try {
    const response = await axios.get(
      `/products-by-item-type/${type}/app/${appId}/${cityId}`,
    );
    const data = response.data.data;

    if (type === "gift_item") {
      productGift.value = data;
    } else if (type === "limited_edition") {
      productLimited.value = data;
    } else if (type === "special_edition") {
      productSpecial.value = data;
    } else if (type === "miniature") {
      productMiniatures.value = data;
    }

    // console.log("Transformed Data:", productCategories.value);
  } catch (error) {
    console.error("Error fetching product categories:", error);
  } finally {
    isLoading.value = false;
  }
};

// const getProductGiftData = async (cityId) => {
//   isLoading.value = true;
//   try {
//     const response = await axios.get(
//       `/products-by-item-type/gift_item/app/${appId}/${cityId}`,
//     );
//     const data = response.data.data;

//     productGift.value = data;

//     // console.log("Transformed Data:", productCategories.value);
//   } catch (error) {
//     console.error("Error fetching product categories:", error);
//   } finally {
//     isLoading.value = false;
//   }
// };

// const getProductLimitedData = async (cityId) => {
//   isLoading.value = true;
//   try {
//     const response = await axios.get(
//       `/products-by-item-type/limited_edition/app/${appId}/${cityId}`,
//     );
//     const data = response.data.data;
//     productLimited.value = data;

//     // console.log("Transformed Data:", productCategories.value);
//   } catch (error) {
//     console.error("Error fetching product categories:", error);
//   } finally {
//     isLoading.value = false;
//   }
// };

// const getProductSpecialData = async (cityId) => {
//   isLoading.value = true;
//   try {
//     const response = await axios.get(
//       `/products-by-item-type/special_edition/app/${appId}/${cityId}`,
//     );
//     const data = response.data.data;
//     productSpecial.value = data;
//     // console.log("Transformed Data:", productCategories.value);
//   } catch (error) {
//     console.error("Error fetching product categories:", error);
//   } finally {
//     isLoading.value = false;
//   }
// };

// const getProductMiniatureData = async (cityId) => {
//   isLoading.value = true;
//   try {
//     const response = await axios.get(
//       `/products-by-item-type/miniature/app/${appId}/${cityId}`,
//     );
//     const data = response.data.data;
//     productMiniatures.value = data;
//     // console.log("Transformed Data:", productCategories.value);
//   } catch (error) {
//     console.error("Error fetching product categories:", error);
//   } finally {
//     isLoading.value = false;
//   }
// };

watch(selectedCountry, (newX) => {
  // console.log("country is", newX);
  getProductCategoryListData(newX.city_id);
  getProductPriceRangeData(newX.city_id);
  getProductEditionData("gift_item", newX.city_id);
  getProductEditionData("limited_edition", newX.city_id);
  getProductEditionData("special_edition", newX.city_id);
  getProductEditionData("miniature", newX.city_id);

  // getProductGiftData(newX.city_id);
  // getProductLimitedData(newX.city_id);
  // getProductSpecialData(newX.city_id);
  // getProductMiniatureData(newX.city_id);
});

onMounted(() => {
  AOS.init();
  setTimeout(() => {
    isZoomed.value = true;
  }, 100); // Small delay to ensure the transition starts after mount

  const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.1, // Trigger when 10% of the element is visible
  });

  const cards = document.querySelectorAll(".fade-in-up");
  cards.forEach((card) => {
    observer.observe(card);
  });

  get4WallsPropertyData();
  getListMainCategories();
  get4WallsPropertyDataCommercial();
});
</script>

<style scoped>
.hero-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
}

.hero-text-container {
  width: 100%;
  /* padding: 20px; */
  /* background-color: #fff; */
  height: 100%;
}

.hero-text-mobile {
  padding: 16px;
}

.hero-title {
  font-weight: bold;
  line-height: 1.2;
}

.main-content-user {
  margin-top: 100px !important;
}
.main-content-guest {
  margin-top: 100vh !important;
}

@media (max-width: 599px) {
  .hero-container {
    top: 30vh !important;
    min-height: 60vh !important;
    height: auto !important;
    overflow: visible !important;
  }

  .hero-title {
    padding-top: 16px;
    margin-top: 16px;
    font-size: 28px;
    line-height: 1.3;
  }
  .hero-text-container {
    margin-top: 5rem !important;
    height: auto;
  }
  .main-content-user {
    margin-top: 30vh !important;
  }
}

.main-content {
  position: relative;
  z-index: 2;
  background-color: #fff;
}

.zoom-effect {
  transition: transform 10s ease-out;
}

.zoomed {
  transform: scale(1.1);
}

.fade-in-up {
  opacity: 0;
  transform: translateY(200px);
  transition:
    opacity 2s ease,
    transform 2s ease;
}

.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}

.featured-title {
  font-family: "DM Serif Display";
}

.featured-sub-title {
  letter-spacing: 5px;
}
</style>
