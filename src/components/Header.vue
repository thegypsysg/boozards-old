<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import axios from "@/util/axios";
import moment from "moment-timezone";
import app from "@/util/eventBus";
import { appId } from "@/main";

// Import images
import boozardsLogo from "@/assets/images/logo/boozards-logo.png";
import homeIcon from "@/assets/images/icons/home.png";
import shopperIcon from "@/assets/images/icons/menu-shopper.png";
import shopIcon from "@/assets/images/icons/shop.png";
import userIcon from "@/assets/images/icons/user_icon.png";
import facebookIcon from "@/assets/images/icons/facebook.png";
import instaIcon from "@/assets/images/icons/insta.png";
import tiktokIcon from "@/assets/images/icons/tiktok.png";
import whatsappIcon from "@/assets/whatsapp.svg";
import ExploreOurMenuList from "./explore-our-menu-list.vue";

// Make images available to template
const images = {
  logo: boozardsLogo,
  home: homeIcon,
  shopper: shopperIcon,
  shop: shopIcon,
  user: userIcon,
  facebook: facebookIcon,
  instagram: instaIcon,
  tiktok: tiktokIcon,
  whatsapp: whatsappIcon,
};

// Props
const props = defineProps({
  titleHeader: String,
  isHeader: Boolean,
  isDesktop: Boolean,
  isProfile: Boolean,
  isSignin: Boolean,
  isBatamProperties: Boolean,
});

// Store, router setup
const store = useStore();
const router = useRouter();
const route = useRoute();

// Essential reactive data
const drawer = ref(false);
const dialog2 = ref(false);
const search = ref(null);
const userImage = ref(null);
const userName = ref(null);
const userDated = ref(null);
const currentTime = ref("");
const screenWidth = ref(window.innerWidth);
const activeMalls = ref([]);
const isLoading = ref(false);

// Location data
const selectedLocation = ref({
  country: "Singapore",
  city: "Singapore City",
});

const locationDropdown = ref([
  {
    country: "Singapore",
    flagUrl: "https://flagcdn.com/w40/sg.png",
    properties: 1,
    cities: [
      {
        name: "Singapore City",
        imageUrl: "https://example.com/singapore-city.jpg",
      },
    ],
  },
  {
    country: "Indonesia",
    flagUrl: "https://flagcdn.com/w40/id.png",
    properties: 1,
    cities: [
      {
        name: "Batam",
        imageUrl: "https://example.com/batam.jpg",
      },
    ],
  },
  {
    country: "India",
    flagUrl: "https://flagcdn.com/w40/in.png",
    properties: 3,
    cities: [
      {
        name: "Mumbai",
        imageUrl: "https://example.com/mumbai.jpg",
      },
      {
        name: "Goa - Margao",
        imageUrl: "https://example.com/goa-margao.jpg",
      },
      {
        name: "Goa - Panjim",
        imageUrl: "https://example.com/goa-panjim.jpg",
      },
    ],
  },
]);

// Computed properties
const isSmall = computed(() => {
  return screenWidth.value < 640;
});

const filteredMalls = computed(() => {
  if (!search.value) return activeMalls.value;
  const searchTextLower = search.value.toLowerCase();
  return activeMalls.value.filter((item) =>
    item.brand_name.toLowerCase().includes(searchTextLower),
  );
});

// Methods
const selectLocation = (country, city) => {
  selectedLocation.value = {
    country: country.country,
    city: city.name,
  };
};

const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

const updateTime = () => {
  const singaporeTime = moment().tz("Asia/Singapore");
  currentTime.value = singaporeTime.format("HH:mm:ss");
};

const logout = () => {
  const token = localStorage.getItem("token");
  axios
    .get(`/gypsy-logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      localStorage.removeItem("name");
      localStorage.removeItem("userName");
      localStorage.removeItem("g_id");
      localStorage.removeItem("user_image");
      localStorage.removeItem("token");
      window.location.href = "/";
    })
    .catch(console.error);
};

const gotoMallDetail = (item) => {
  dialog2.value = false;
  router.push(`/mall-id/${item?.id}`);
  localStorage.setItem("mallDetailData", JSON.stringify(item));
};

const gotoMerchantDetail = (item) => {
  dialog2.value = false;
  router.push(`/merchant-id/${item?.merchant_id}`);
  localStorage.setItem("merchantDetailData", JSON.stringify(item));
};

const getProductCategoryListData = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`/categories-with-products/app/${appId}`);
    const data = response.data.data;

    const initialData = data
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
            //isCount: false,
            //count: 1,
          })),
        ),
      }));

    activeMalls.value = initialData.flatMap((category) => category.products);

    console.log("Transformed Data:", activeMalls.value);
  } catch (error) {
    console.error("Error fetching product categories:", error);
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  handleResize();
  // Set initial screen width
  // screenWidth.value = window.innerWidth;

  // Add resize listener
  window.addEventListener("resize", handleResize);
  setInterval(updateTime, 1000);

  // Set default location
  const defaultCountry = locationDropdown.value[0];
  const defaultCity = defaultCountry.cities[0];
  selectLocation(defaultCountry, defaultCity);
  getProductCategoryListData();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
const filterList = ref(["View All", "Europe", "Asia"]);

const handleTrendingChange = (item) => {
  console.log("Selected filter:", item);
  // Add your filter logic here
};
</script>

<template>
  <v-app-bar
    v-if="(isDesktop && !isHeader) || (isSmall && !isHeader)"
    :class="{
      'px-8': isHeader || isProfile,
    }"
    color="white"
    elevation="1"
    fixed
  >
    <router-link to="/">
      <div class="logo-img-container ml-4">
        <v-img
          class="logo-img"
          :src="images.logo"
          height="35"
          eager
          transition="fade-transition"
        >
          <template #placeholder>
            <!-- <v-skeleton-loader type="image"></v-skeleton-loader> -->
          </template>
        </v-img>
      </div>
    </router-link>

    <v-menu>
      <template #activator="{ props }">
        <v-btn
          class="ml-4 location-selector"
          v-bind="props"
          variant="text"
          color="#494949"
          append-icon="mdi-chevron-down"
        >
          <div class="d-flex align-center gap-2">
            <v-avatar size="24" v-if="selectedLocation.country">
              <v-img
                :src="
                  locationDropdown.find(
                    (l) => l.country === selectedLocation.country,
                  )?.flagUrl
                "
                cover
              ></v-img>
            </v-avatar>
            <span>{{ selectedLocation.city }}</span>
          </div>
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-card-title>
          <span class="text-subtitle-2">Choose Your Location</span>
        </v-card-title>

        <v-list>
          <template v-for="(location, index) in locationDropdown" :key="index">
            <!-- Country Header -->
            <v-list-subheader>
              <div class="d-flex align-center gap-2">
                <v-avatar size="24">
                  <v-img :src="location.flagUrl" cover></v-img>
                </v-avatar>
                <span class="text-subtitle-1 font-weight-medium">
                  {{ location.country }} ({{ location.properties }} Properties)
                </span>
              </div>
            </v-list-subheader>

            <!-- Cities -->
            <v-list-item
              v-for="(city, cityIndex) in location.cities"
              :key="`${index}-${cityIndex}`"
              :value="city.name"
              :active="selectedLocation.city === city.name"
              variant="text"
              active-color="primary"
              @click="selectLocation(location, city)"
              class="pl-7"
            >
              <template #prepend>
                <v-avatar size="24" class="mr-2">
                  <v-img :src="city.imageUrl" cover></v-img>
                </v-avatar>
              </template>
              <v-list-item-title>{{ city.name }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-menu>

    <div
      v-if="isHeader || isProfile"
      class="ml-6 d-flex flex-column navbar-header"
      :class="{ 'navbar-header-mobile': !isDesktop && isProfile }"
    >
      <div class="divider" :class="{ 'd-none': !isDesktop && isProfile }" />
      <h1>{{ titleHeader }}</h1>
    </div>

    <v-spacer v-if="isHeader || isProfile" />

    <form
      v-if="!isHeader && !isProfile && !isBatamProperties"
      class="navbar__search navbar__search__desktop"
    >
      <v-autocomplete
        id="product_name"
        v-model="search"
        class="form-control mr-sm-2 ml-md-n3 search-input"
        item-title="brand_name"
        item-value="brand_name"
        :items="activeMalls"
        style="font-style: italic"
        placeholder="Type your brands... Chivas,Monkey,Roku,"
        density="compact"
        color="blue-grey-lighten-2"
      >
        <template #item="{ props, item }">
          <div
            v-if="item.raw.ranges.length > 0"
            class="mb-4 px-2"
            v-bind="props"
          >
            <router-link
              class="text-decoration-none text-black font-weight-bold"
              to="#"
            >
              <p
                style="font-size: 12px"
                class="font-weight-bold text-red-darken-4 mb-2"
              >
                {{ item.raw.brand_name }}
              </p>
              <div
                v-for="range in item.raw.ranges"
                class="d-flex align-center w-100 mb-2"
              >
                <div style="width: 15%" class="mr-2">
                  <div
                    style="
                      height: 45px;
                      width: 100%;
                      object-fit: cover;
                      object-position: center;
                    "
                  >
                    <v-img
                      height="45"
                      cover
                      :src="
                        range.image_1
                          ? $fileURL + range.image_1
                          : $fileURL + item.raw.image
                      "
                    >
                      <template #placeholder>
                        <div class="skeleton" />
                      </template>
                    </v-img>
                  </div>
                </div>
                <div
                  class="d-flex align-center justify-space-between"
                  style="font-size: 12px; width: 85%"
                >
                  <div class="">
                    <p class="mb-1 font-weight-regular">
                      {{ `${item?.raw?.product_name}` }}
                    </p>
                    <p class="font-weight-regular">
                      <span>{{
                        `${range?.quantity?.quantity_name} | 40%`
                      }}</span>
                    </p>
                  </div>
                  <p class="font-weight-bold text-red-darken-4">S$ 67.50</p>
                </div>
              </div>
            </router-link>
          </div>
        </template>
      </v-autocomplete>
      <button class="btn btn--search" type="submit">
        <v-icon color="white"> mdi-magnify </v-icon>
      </button>
    </form>

    <!-- <div v-if="isBatamProperties" class="d-none d-md-flex ga-2 w-100">
      <div class="text-h4 font-weight-black text-no-wrap">
        <span class="text-red-darken-4">Batam</span> Properties
      </div>
      <div class="d-flex justify-center w-100">
        <div class="d-flex gap-2 align-center text-caption">
          <label class="text-subtitle-1 text-no-wrap"
            >Indonesia (5 Properties)</label
          >
          <v-select
            v-model="selected"
            :items="['Property 1', 'Property 2', 'Property 3']"
            label="Select an option"
          ></v-select>
        </div>
        <div class="d-flex gap-2 align-center text-caption">
          <label class="text-subtitle-1 text-no-wrap"
            >Batam (5 Properties)</label
          >
          <v-select
            v-model="selected"
            :items="['Property 1', 'Property 2', 'Property 3']"
            label="Select an option"
          ></v-select>
        </div>
      </div>
    </div> -->

    <div
      v-if="!isHeader && !isProfile && !userName && !isSmall"
      class="btn_sign__up-cont"
    >
      <v-btn elevation="0" class="btn_sign__up" to="">
        <span> Sign Up / Sign In</span>
      </v-btn>
      <div class="btn_sign__up-hover" />
    </div>

    <v-btn
      v-if="!isHeader && !isProfile && !isSmall && userName"
      elevation="0"
      class="btn_log__out"
      :class="{ 'mr-6': tokenStart }"
      @click="logout"
    >
      Logout
    </v-btn>
    <div>
      <div v-if="!isSmall" class="cart d-flex align-center">
        <div class="cart-line mr-2" />
        <v-icon size="35" color="black"> mdi mdi-cart-variant </v-icon>
        <span>$ 0</span>
      </div>
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
          <v-skeleton-loader type="image"></v-skeleton-loader>
        </template>
      </v-img>
      <img
        v-else-if="userImage == null && !isLoading"
        :src="images.user"
        cover
        height="48"
        style="height: 100%; width: 100%"
      />
    </div>

    <template v-if="!isProfile" #extension>
      <div class="mobile__app text-center w-100">
        <template v-if="activeLocationButton && isSmall">
          <v-menu v-if="locationPlaceholder" v-model="userLocation">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="text"
                v-bind="props"
                color="#494949"
                append-icon="mdi-chevron-down"
              >
                <template v-slot:prepend>
                  <v-avatar
                    :image="$fileURL + itemSelectedComplete?.flag"
                    size="x-small"
                  ></v-avatar>
                </template>

                {{ locationPlaceholder }}
              </v-btn>
            </template>

            <v-card min-width="300">
              <v-card-title>
                <div class="d-flex align-center ga-2">
                  <v-icon size="small">mdi-map-marker</v-icon>
                  <p class="text-subtitle-2">Choose Your Location</p>
                </div>
              </v-card-title>

              <v-list v-for="(data, index) in country" :key="index">
                <v-list-subheader>
                  <div class="d-flex align-center ga-2">
                    <v-avatar
                      :image="$fileURL + data?.flag"
                      size="x-small"
                    ></v-avatar>
                    <p class="text-subtitle-1 font-weight-medium">
                      {{ data.country_name }} ({{ data.cities.length }}
                      Properties)
                    </p>
                  </div>
                </v-list-subheader>

                <v-list-item
                  :active="activeCity.city_id === dataCity.city_id"
                  v-for="(dataCity, indexCities) in data.cities"
                  :key="indexCities"
                  :value="dataCity.city_id"
                  variant="text"
                  active-color="primary"
                  @click="changeItemSelected(dataCity, data)"
                >
                  <v-list-item-title>
                    <div class="d-flex ml-7 align-center ga-2">
                      <v-avatar
                        :image="$fileURL + dataCity?.city_image"
                        size="x-small"
                      ></v-avatar>
                      <p class="">{{ dataCity.city_name }}</p>
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>

          <v-skeleton-loader
            width="200"
            v-else
            type="list-item-two-line"
          ></v-skeleton-loader>
        </template>
        <div
          v-if="!isHeader && !isProfile && !userName && isSmall"
          class="btn_sign__up-cont mx-auto my-4"
        >
          <v-btn elevation="0" class="btn_sign__up d-flex align-center" to="">
            <span> Sign Up / Sign In</span>
          </v-btn>
          <div class="btn_sign__up-hover" />
        </div>
        <v-btn
          v-if="!isHeader && !isProfile && !isSmall && userName"
          elevation="0"
          class="btn_log__out"
          :class="{ 'mr-6': tokenStart }"
          @click="logout"
        >
          Logout
        </v-btn>

        <form class="navbar__search navbar__search__mobile mx-auto">
          <v-autocomplete
            id="product_name"
            v-model="search"
            class="form-control mr-sm-2 ml-md-n3 search-input"
            item-title="brand_name"
            item-value="brand_name"
            :items="activeMalls"
            style="font-style: italic"
            placeholder="Type your brands... Chivas,Monkey,Roku,"
            density="compact"
            color="blue-grey-lighten-2"
          >
            <template #item="{ props, item }">
              <div
                v-if="item.raw.ranges.length > 0"
                class="mb-4 px-2"
                v-bind="props"
              >
                <router-link
                  class="text-decoration-none text-black font-weight-bold"
                  to="#"
                >
                  <p
                    style="font-size: 12px"
                    class="font-weight-bold text-red-darken-4 mb-2"
                  >
                    {{ item.raw.brand_name }}
                  </p>
                  <div
                    v-for="range in item.raw.ranges"
                    class="d-flex align-center w-100 mb-2"
                  >
                    <div style="width: 15%" class="mr-2">
                      <div
                        style="
                          height: 45px;
                          width: 100%;
                          object-fit: cover;
                          object-position: center;
                        "
                      >
                        <v-img
                          height="45"
                          cover
                          :src="
                            range.image_1
                              ? $fileURL + range.image_1
                              : $fileURL + item.raw.image
                          "
                        >
                          <template #placeholder>
                            <div class="skeleton" />
                          </template>
                        </v-img>
                      </div>
                    </div>
                    <div
                      class="d-flex align-center justify-space-between"
                      style="font-size: 12px; width: 85%"
                    >
                      <div class="">
                        <p class="mb-1 font-weight-regular">
                          {{ `${item?.raw?.product_name}` }}
                        </p>
                        <p class="font-weight-regular">
                          <span>{{
                            `${range?.quantity?.quantity_name} | 40%`
                          }}</span>
                        </p>
                      </div>
                      <p class="font-weight-bold text-red-darken-4">S$ 67.50</p>
                    </div>
                  </div>
                </router-link>
              </div>
            </template>
          </v-autocomplete>
          <button class="btn btn--search" type="submit">
            <v-icon color="white"> mdi-magnify </v-icon>
          </button>
        </form>

        <!-- FILTER LIST -->
        <!-- to do: this should be added to the header on small screens and used to display the overflowing section -->
        <!-- <div class="d-md-none" id="trending-filter-container">
      <div id="trending-item" class="d-flex ga-2 py-3 w-100 px-2">
        <div class="flex-fill d-flex ga-2" id="scroll-trending">
          <template v-for="(item, index) in filterList" :key="index">
            <v-btn @click="handleTrendingChange(item)" class="bg-white rounded-pill border-thin" elevation="0">
              {{ item }}
            </v-btn>
          </template>
        </div>
      </div>
    </div> -->

        <div v-if="isSmall" class="ma-4">
          <ExploreOurMenuList :desktop="false" />
        </div>

        <div id="trending-container" class="d-sm-none"></div>

        <div
          v-if="
            $route.name == 'Trending-buy' ||
            $route.name == 'Trending-rent' ||
            $route.name == 'Trending-roommates' ||
            $route.name == 'Trending-staycation' ||
            $route.name == 'Trending-vacation' ||
            $route.name == 'Trending-co-living' ||
            $route.name == 'Trending-co-working'
          "
          class="d-md-none mx-auto pt-md-0 px-4 medium:px-20"
          style="max-width: 1200px; overflow-x: hidden"
        >
          <div
            class="d-flex justify-center ga-6 my-5"
            style="min-width: fit-content"
          >
            <template v-for="n in trendings" :key="n">
              <v-btn
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
        <!-- <div>TEST</div>
        <div>TEST</div> -->
      </div>
    </template>
  </v-app-bar>

  <!-- v-if="isSmall" -->
  <v-navigation-drawer v-model="drawer" temporary location="right">
    <div
      class="drawer__top"
      :class="{ 'py-6': userName == null, 'py-2': userName != null }"
    >
      <router-link v-if="userName == null" class="text-decoration-none" to="">
        <span style="font-size: 1.125rem; color: white">Sign up / Sign In</span>
      </router-link>
      <div v-else class="d-flex align-center">
        <div style="width: 55px; height: 55px; border-radius: 50%">
          <v-img
            cover
            style="border-radius: 50%; width: 100%; height: 100%"
            :src="
              userImage != null
                ? userImage
                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            "
          >
            <template #placeholder>
              <v-skeleton-loader type="image"></v-skeleton-loader>
            </template>
          </v-img>
        </div>

        <v-list-item>
          <v-list-item-title style="font-size: 14px">
            {{ userName }}
          </v-list-item-title>
          <v-list-item-subtitle style="font-size: 10px" class="mt-1">
            Last Login: {{ userDated }}
          </v-list-item-subtitle>
          <div
            class="text-red mt-1"
            style="font-size: 12px; cursor: pointer"
            @click="logout"
          >
            Logout
          </div>
        </v-list-item>
      </div>
    </div>
    <div class="drawer__heading">
      <div class="drawer-logo">
        <v-img
          height="35"
          width="80"
          src="@/assets/images/logo/boozards-logo.png"
        />
      </div>
      <v-menu contained style="z-index: 1000">
        <template #activator="{ props }">
          <v-btn
            style="background: #f4f5f7; color: black"
            variant="text"
            color="black"
            icon="mdi-share-outline"
            width="30"
            height="30"
            class="mx-4"
            v-bind="props"
          >
            <v-icon color="rgb(38, 38, 38)" size="15">
              mdi-share-outline
            </v-icon>
          </v-btn>
        </template>
        <v-list style="z-index: 1000">
          <v-list-item @click="console.log('share')">
            <v-list-item-title>
              <v-icon class="mr-4" color="black" size="18">
                mdi-email-outline </v-icon
              >Email
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="console.log('share')">
            <v-list-item-title>
              <v-icon class="mr-4" size="18">
                <i class="fa-brands fa-facebook-f" /> </v-icon
              >Facebook
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="console.log('share')">
            <v-list-item-title>
              <v-icon class="mr-4" color="black" size="18"> mdi-twitter </v-icon
              >Twitter
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="console.log('share')">
            <v-list-item-title>
              <v-icon class="mr-4" size="18">
                <i class="fa-brands fa-linkedin-in" /> </v-icon
              >Linkedin
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <div class="text-muted" style="font-size: 10px">Version 1.0</div>
    </div>
    <v-divider />
    <ul class="pt-1" nav dense>
      <li class="v-list-item">
        <div class="v-list-item__icon">
          <v-img height="20" width="30" :src="images.home" />
        </div>
        <v-list-item-title style="font-size: 12px"> Home </v-list-item-title>
      </li>

      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img height="18" width="25" :src="images.shopper" />
        </div>
        <router-link class="text-decoration-none text-black" to="/my-profile">
          <v-list-item-title style="font-size: 12px">
            My Profile
          </v-list-item-title>
        </router-link>
      </li>

      <li class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img height="18" width="25" :src="images.shop" />
        </div>
        <v-list-item-title style="font-size: 12px"> My Cart </v-list-item-title>
      </li>

      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>
        <v-list-item-title style="font-size: 12px">
          My Vouchers
        </v-list-item-title>
      </li>
      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>

        <v-list-item-title style="font-size: 12px">
          My Favorites
        </v-list-item-title>
      </li>
      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>

        <v-list-item-title style="font-size: 12px"> My Apps </v-list-item-title>
      </li>
      <li v-if="userName == null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>
        <router-link
          class="text-decoration-none text-black"
          to="/privacy-policy"
        >
          <v-list-item-title style="font-size: 12px">
            Privacy Policy
          </v-list-item-title>
        </router-link>
      </li>
      <li v-if="userName == null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>

        <router-link class="text-decoration-none text-black" to="/our-terms">
          <v-list-item-title style="font-size: 12px">
            Terms & Conditions
          </v-list-item-title>
        </router-link>
      </li>
    </ul>
    <div class="drawer__bottom">
      <div class="text-center" style="width: 100%">
        <p style="font-size: 13px" class="mb-1">Made in Singapore</p>
        <h3 style="font-size: 13px">Get connected</h3>
        <v-row
          class="d-flex justify-center mt-1"
          :class="{ 'mb-2': userName == null }"
        >
          <v-col cols="3" class="d-flex justify-end">
            <a :href="contactData?.facebook">
              <v-img :src="images.facebook" height="40" width="32" />
            </a>
          </v-col>
          <v-col class="d-flex justify-center" cols="3">
            <a :href="contactData?.instagram">
              <v-img :src="images.instagram" height="40" width="32" />
            </a>
          </v-col>
          <v-col class="d-flex justify-start" cols="3">
            <a :href="contactData?.tiktok">
              <v-img :src="images.tiktok" class="mt-1" height="35" width="35" />
            </a>
          </v-col>
          <v-col
            class="d-flex justify-center flex-column align-center"
            cols="12"
          >
            <p class="text-caption">Wha'ts App Support (24 hrs)</p>
            <a
              :href="`https://api.whatsapp.com/send?phone=${footerData?.whats_app}&text=The Gypsy Support here - How may I help you. ?`"
            >
              <v-img
                :src="images.whatsapp"
                class="mt-1"
                height="35"
                width="35"
              />
            </a>
          </v-col>
        </v-row>
        <div
          v-if="userName != null"
          style="font-size: 12px"
          class="text-grey my-4"
        >
          <router-link
            class="text-decoration-none text-grey"
            to="/privacy-policy"
          >
            Privacy
          </router-link>
          |
          <router-link class="text-decoration-none text-grey" to="/our-terms">
            Terms
          </router-link>
        </div>
        <!-- <div class="drawer-social d-flex" style="width: 100%">
          <div>
            <h5>WhatsApp</h5>
            <a
              style="text-decoration: none; font-size: 10px"
              :href="`https://api.whatsapp.com/send?phone=${footerData?.whats_app}&text=Hello!`"
            >
              {{ contactData?.whats_app }}
            </a>
          </div>
          <div>
            <h5>Contact us</h5>
            <a
              style="text-decoration: none; font-size: 10px"
              :href="`mailto:${contactData?.email_id}`"
              >{{ contactData?.email_id }}</a
            >
          </div>
        </div> -->
        <v-divider class="mt-2 mb-n2" />
        <v-container class="footer-bottom pb-2 d-flex justify-center">
          <div class="d-flag d-flex justify-space-between w-100 align-center">
            <img
              style="max-width: 40px; border: 1px solid black"
              src="data:image/png;base64,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"
              alt="Singapore"
            />
            <div id="footerCurrentTime" style="font-size: 0.7rem">
              {{ currentTime }}
            </div>
          </div>
        </v-container>
      </div>
    </div>
  </v-navigation-drawer>

  <v-dialog
    v-model="dialog2"
    fullscreen
    persistent
    height="90vh"
    class="mt-16"
    z-index="1000000"
  >
    <v-card
      height="90vh"
      class="mt-16"
      style="border-top-left-radius: 30px; border-top-right-radius: 30px"
    >
      <v-card-title
        class="pt-10 d-flex justify-space-between position-fixed bg-white"
        style="z-index: 1000"
      >
        <div class="navbar__search navbar__search__mobile w-100">
          <v-text-field
            id="product_name"
            v-model="search"
            class="form-control mr-sm-2 ml-md-n3 search-input"
            style="font-style: italic"
            placeholder="Explore Properties"
            density="compact"
            color="blue-grey-lighten-2"
            clearable
          />
          <button class="btn btn--search">
            <v-icon color="white"> mdi-magnify </v-icon>
          </button>
        </div>
        <v-btn
          variant="text"
          icon="mdi-close"
          text="Ok"
          @click="dialog2 = false"
        />
      </v-card-title>

      <v-card-text
        class="px-4"
        style="padding-bottom: 100px; padding-top: 120px"
      >
        <div v-for="(item, index) in filteredMalls" :key="index" class="mb-2">
          <div
            v-if="!item?.mmo_id"
            class="text-black font-weight-bold"
            style="font-size: 12px"
            @click="gotoMallDetail(item)"
          >
            <div class="d-flex align-center" style="width: 100%">
              <div style="width: 20% !important" class="py-1">
                <v-img
                  height="40"
                  style="
                    width: 100% !important;
                    object-fit: cover !important;
                    object-position: center !important;
                  "
                  :src="item?.mainImage"
                >
                  <template #placeholder>
                    <v-skeleton-loader type="image"></v-skeleton-loader>
                  </template>
                </v-img>
              </div>
              <div style="width: 80% !important" class="pl-2">
                <p class="mb-1">
                  {{ `${item?.name} (${item?.subIndustryName})` }}
                </p>
                <p class="text-grey">
                  <span>{{ `${item?.town}` }}</span> (<span class="text-red">{{
                    `${item?.distanceText}`
                  }}</span
                  ><span class="text-black"> away</span>)
                </p>
              </div>
            </div>
          </div>
          <div
            v-else
            class="mb-2 text-black font-weight-bold"
            style="font-size: 12px"
            @click="gotoMerchantDetail(item)"
          >
            <div class="d-flex align-center" style="width: 100%">
              <div style="width: 20% !important" class="py-1">
                <v-img
                  height="40"
                  style="
                    width: 100% !important;
                    object-fit: cover !important;
                    object-position: center !important;
                  "
                  :src="item?.image"
                >
                  <template #placeholder>
                    <v-skeleton-loader type="image"></v-skeleton-loader>
                  </template>
                </v-img>
              </div>
              <div style="width: 80% !important" class="pl-2">
                <p class="mb-1">
                  {{ item?.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.app-bar-mobile-start {
  height: 28vh !important;
}

header.v-sheet.v-app-bar {
  height: 172px !important;
}

.v-app-bar.v-toolbar {
  max-width: 100%;
}

.logo-img-container {
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100px;
  /* set to whatever value suits your needs */
}

@media (max-width: 599px) {
  .logo-img-container {
    min-height: 50px;
    /* set to whatever value suits your needs */
    min-width: 50px;
    /* set to whatever value suits your needs */
  }
}

.logo-img {
  width: 100%;
  height: 100%;
}

.divider {
  background: black;
  width: 2px;
  height: 80px;
}

.navbar-header {
  align-items: center;
  gap: 25px;
  font-size: 20px;
  color: black;
  font-weight: 700;
}

.navbar-header-mobile {
  font-size: 12px;
  /* display: grid !important;
  grid-template-columns: 1fr 1fr !important; */
}

.btn_sign__up-cont {
  position: relative;
  overflow: hidden;
  background: #0197d5;
  width: min-content;
}

.btn_sign__up span {
  z-index: 1000;
}

.btn_sign__up-hover {
  position: absolute;
  border-radius: 50%;
  bottom: -50px;
  height: 50px;
  width: 100%;
  background: #002e41;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}

.btn_sign__up-cont:hover .btn_sign__up-hover {
  bottom: 0px;
  border-radius: 0px;
}

.w15 {
  width: 15%;
}

.w85 {
  width: 85%;
}

.gap-2 {
  gap: 8px;
}

.gap-2 {
  gap: 8px;
}

.v-list-item {
  min-height: 44px !important;
}

.v-list-item--active {
  background-color: #f5f5f5;
}

.location-selector {
  background-color: #f5f5f5 !important;
  border-radius: 8px;
  padding: 0 16px;
  height: 50px;
}

.location-selector:hover {
  background-color: #eeeeee !important;
}

#trending-filter-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

#trending-filter-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

#scroll-trending {
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  gap: 8px;
  padding-bottom: 4px;
}

/* Make buttons more compact on mobile */
@media (max-width: 599px) {
  #scroll-trending .v-btn {
    padding: 0 16px !important;
  }
}

/* Add media query for small screens */
@media (max-width: 599px) {
  .btn_sign__up {
    width: 100%; /* Make button full width */
  }

  /* Add this to the parent container to enable flex wrapping */
  .v-app-bar > .v-container {
    flex-wrap: wrap;
  }
}
</style>
