<script>
import { mapState, mapMutations } from "vuex";
import axios from "@/util/axios";
import moment from "moment-timezone";
import app from "@/util/eventBus";

export default {
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  name: "Header",
  props: [
    "titleHeader",
    "isHeader",
    "isDesktop",
    "isProfile",
    "isSignin",
    "isBatamProperties",
  ],
  data() {
    return {
      titleWelcome: "Sign-Up / Sign-in",
      tokenStart: null,
      userImage: null,
      userName: null,
      userDated: null,
      isLoading: false,
      dialog: false,
      dialog2: false,
      drawer: false,
      headerData: {},
      logo: "",
      search: null,
      activeMalls: [],
      countryId: null,
      country: [],
      city: [],
      arr1: [],
      arr2: [],
      currentTime: "",
      screenWidth: window.innerWidth,
      selectedPlace: null,
      selectedCountry: "Singapore",
      isTrending: false,
      trendings: [],
      userLocation: false,
      //Sample
      admins: [
        ["Management", "mdi-account-multiple-outline"],
        ["Settings", "mdi-cog-outline"],
      ],
      cruds: [
        ["Create", "mdi-plus-outline"],
        ["Read", "mdi-file-outline"],
        ["Update", "mdi-update"],
        ["Delete", "mdi-delete"],
      ],
      open: ["Users"],
    };
  },
  computed: {
    ...mapState(["itemSelected"]),
    ...mapState(["itemSelected2"]),
    ...mapState(["itemSelectedComplete"]),
    ...mapState(["itemSelected2Complete"]),
    ...mapState(["itemSelected", "ativeTag"]),
    latitude() {
      return localStorage.getItem("latitude");
    },
    longitude() {
      return localStorage.getItem("longitude");
    },
    countryDevice() {
      return localStorage.getItem("countryDevice");
    },
    isSmall() {
      return this.screenWidth < 640;
    },
    filteredMalls() {
      if (!this.search) {
        return this.activeMalls;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.activeMalls.filter((item) =>
        item.name.toLowerCase().includes(searchTextLower),
      );
    },
    tokenProvider() {
      // Mendapatkan URL dari browser
      const url = new URL(window.location.href);

      // Mendapatkan nilai token dari parameter query 'token'
      const tokenParam = url.searchParams.get("token");
      if (tokenParam) {
        localStorage.setItem("token", tokenParam);
      }

      // Mengupdate data 'token' dalam komponen dengan nilai yang ditemukan
      return tokenParam;
    },
    token() {
      return localStorage.getItem("token");
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    setInterval(this.updateTime, 1000);
  },

  beforeUnmount() {
    app.config.globalProperties.$eventBus.$off(
      "changeHeaderImage",
      this.changeHeaderImage,
    );
    app.config.globalProperties.$eventBus.$off(
      "getTokenStart",
      this.getTokenStart,
    );
    app.config.globalProperties.$eventBus.$off(
      "getHeaderUserData",
      this.getHeaderUserData,
    );
    app.config.globalProperties.$eventBus.$off(
      "changeHeaderWelcome2",
      this.changeHeaderWelcome2,
    );
    app.config.globalProperties.$eventBus.$off(
      "changeHeaderWelcome3",
      this.changeHeaderWelcome3,
    );

    app.config.globalProperties.$eventBus.$off("openSearch", this.openSearch);
  },
  methods: {
    ...mapMutations([
      "setItemSelected",
      "setItemSelectedComplete",
      "setItemSelected2",
      "setItemSelected2Complete",
      "setSelectedTrending",
    ]),
    changeHeaderImage(image) {
      this.userImage = this.$fileURL + image;
    },
    changeHeaderWelcome2() {
      this.userName = localStorage.getItem("name");
      this.userDated = localStorage.getItem("last_login");
      this.userImage = this.$fileURL + localStorage.getItem("user_image");

      this.getHeaderUserData();
      // this.titleWelcome = title;
    },
    changeHeaderWelcome3() {
      this.getHeaderUserData2();
    },
    loginGypsy() {
      const externalURL = `https://www.the-gypsy.sg/sign-in?app_id=${this.$appId}`;
      window.location.href = externalURL;

      //axios
      //  .post(`/gypsy-login/google`, {
      //    app_id: 5,
      //  })
      //  .then((response) => {
      //    console.log(response);
      //    //if (response) {
      //    //  window.location.assign(response.data.target_url);
      //    //} else {
      //    //  window.location.href = "/sign-in";
      //    //}
      //    //console.log(response.data.target_url);
      //  })
      //  .catch((error) => {
      //    throw error;
      //    //window.location.href = "/sign-in";
      //  });
    },

    getTokenStart(tokenParam) {
      this.tokenStart = tokenParam;
    },
    logout() {
      const token = localStorage.getItem("token");
      axios
        .get(`/gypsy-logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;

          localStorage.setItem("name", null);
          localStorage.setItem("userName", null);
          localStorage.setItem("g_id", null);
          localStorage.setItem("user_image", null);
          localStorage.setItem("token", null);
          app.config.globalProperties.$eventBus.$emit("getUserName");
          this.path = "/";
          window.location.href = "/";
        })
        .catch((error) => {
          // eslint-disable-next-line
          throw error;
        });
    },
    getHeaderUserData() {
      this.isLoading = true;
      //console.log(this.tokenProvider);
      const token = localStorage.getItem("token");
      axios
        .get(`/gypsy-user`, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          //console.log(data);

          this.userName = data.name;
          localStorage.setItem("userName", data.name);
          this.userDated = data.last_login;
          this.userImage =
            data.image != null ? this.$fileURL + data.image : null;
          app.config.globalProperties.$eventBus.$emit("getUserName");
          // this.userImage = null;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status == 401);
          if (error.response.status == 401) {
            localStorage.setItem("name", null);
            localStorage.setItem("userName", null);
            localStorage.setItem("g_id", null);
            localStorage.setItem("user_image", null);
            localStorage.setItem("token", null);
            app.config.globalProperties.$eventBus.$emit("getUserName");
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getHeaderUserData2() {
      this.isLoading = true;
      const token = localStorage.getItem("token");
      axios
        .get(`/gypsy-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          // console.log(data);

          this.userName = data.name;
          this.userDated = data.last_login;
          this.userImage =
            data.image != null ? this.$fileURL + data.image : null;
          // this.userImage = null;
        })
        .catch((error) => {
          // eslint-disable-next-line
          throw error;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    gotoMallDetail(item) {
      this.dialog2 = false;
      this.$router.push(`/mall-id/${item?.id}`);
      localStorage.setItem("mallDetailData", JSON.stringify(item));
    },
    gotoMerchantDetail(item) {
      this.dialog2 = false;
      this.$router.push(`/merchant-id/${item?.merchant_id}`);
      localStorage.setItem("merchantDetailData", JSON.stringify(item));
    },
    openSearch() {
      this.dialog2 = true;
    },
    updateTime() {
      // Ambil zona waktu Singapore
      const singaporeTime = moment().tz("Asia/Singapore");
      // Format waktu dalam hh:mm:ss
      this.currentTime = singaporeTime.format("HH:mm:ss");
    },
    getActiveMallData() {
      axios
        .get(
          `/malls/active-list/${this.latitude}/${this.longitude}/-1/${
            this.itemSelectedComplete?.id || 1
          }`,
        )
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          const result = data
            .sort((a, b) => a.partner_name.localeCompare(b.partner_name))
            .map((item) => {
              return {
                ...item,
                id: item.mall_id || 0,
                town: item.town_name || "",
                city: item.city_name || "",
                country: item.country_name || "",
                distance: item.distance || 0,
                distanceText: this.formatDistance(item.distance),
                featured: item.featured || "N",
                latitude: item.latitude || "",
                longitude: item.longitude || "",
                logo: this.$fileURL + item.logo || "",
                mainImage: this.$fileURL + item.main_image || "",
                oneCity: item.one_city || "N",
                partnerId: item.partner_id || 0,
                name: item.partner_name || "",
                subIndustryName: item.sub_industry_name || "",
              };
            });
          this.activeMalls.push(...result);
          // console.log(this.activeMalls);
        })
        .catch((error) => {
          // eslint-disable-next-line
          throw error;
        });
    },
    getMallMerchantItemsByCountry() {
      axios
        .get(
          this.itemSelectedComplete?.id
            ? `/mall-merchant-outlets/list-by-status/all/${this.latitude}/${
                this.longitude
              }/${this.itemSelectedComplete?.id || 1}`
            : `/mall-merchant-outlets/list-by-status/all/${this.latitude}/${this.longitude}/1`,
        )
        .then((response) => {
          const data = response.data.data;

          const items = data
            .filter((item) => item.active === "Y")
            .map((item) => {
              return {
                ...item,
                name: item?.partner_name || "",
                image: this.$fileURL + item.logo || "",
                distanceText: this.formatDistance(parseInt(item?.distance)),
              };
            });

          let uniqueItems = {};
          for (let i = 0; i < items.length; i++) {
            const name = items[i].name;
            if (!uniqueItems[name]) {
              uniqueItems[name] = {
                ...items[i],
                name: name,
                image: items[i].image,
              };
            }
          }

          // this.mallMerchantItems = Object.values(uniqueItems);
          const result = Object.values(uniqueItems);

          this.activeMalls.push(...result);
          // console.log(this.activeMalls);

          // this.mallPromotionsItems = data
          //   .filter((item) => item.active === "Y")
          //   .map((item) => {
          //     return {
          //       id: item.mmo_id || 1,
          //       name: item.mall_name || "",
          //     };
          //   });
        })
        .catch((error) => {
          // eslint-disable-next-line
          throw error;
        });
    },
    formatDistance(distance) {
      if (distance === 0 || distance === null) {
        return "0";
      } else {
        return distance.toFixed(1);
      }
    },
    getLogo() {
      axios
        .get(`/app/logo/${this.$appId}`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.logo = data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          throw error;
        });
    },

    setDefaultCountry() {},
    async getCountryMall() {
      this.isLoading = true;

      let link = `/app-country-list/${this.$appId}`;

      try {
        const { data: data } = await axios.get(link);

        let allCountry = data.data.map((country) => {
          return {
            ...country,
            id: country.country_id,
            title: country.country_name,
            count: country.property_count,
            oneCity: country.one_city == "Y" ? true : false,
            path: "#",
            flag: country.flag,
            cities: [],
          };
        });

        const defaultCountry = data
          .filter((c) => c.country_name == this.countryDevice)
          .map((country) => {
            return {
              id: country.country_id,
              title: country.country_name,
              count: country.property_count,
              oneCity: country.one_city == "Y" ? true : false,
              path: "#",
              flag: country.flag,
              cities: [],
            };
          });

        this.country = allCountry;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }

      axios
        .get(`/app-country-list/${this.$appId}`)
        .then((response) => {
          const data = response.data.data;
          this.country = data.map((country) => {
            return {
              id: country.country_id,
              title: country.country_name,
              count: country.property_count,
              oneCity: country.one_city == "Y" ? true : false,
              path: "#",
              flag: country.flag,
              cities: [],
            };
          });

          // console.log(this.country);
          const defaultCountry = data
            .filter((c) => c.country_name == this.countryDevice)
            .map((country) => {
              return {
                id: country.country_id,
                title: country.country_name,
                count: country.property_count,
                oneCity: country.one_city == "Y" ? true : false,
                path: "#",
                flag: country.flag,
                cities: [],
              };
            });
          // console.log("map country head", defaultCountry);
          this.setItemSelectedComplete(
            defaultCountry.length > 0 ? defaultCountry[0] : this.country[0],
          );
          localStorage.setItem(
            "mallCount",
            defaultCountry.length > 0
              ? defaultCountry[0].count
              : this.country[0].count,
          );
          this.setItemSelected(
            defaultCountry.length > 0
              ? defaultCountry[0].title
              : this.country[0].title,
          );
          if (this.selectedPlace == null) {
            this.selectedPlace =
              defaultCountry.length > 0
                ? defaultCountry[0].title
                : this.country[0].title;
          }
          this.getCityMall();
          // this.getActiveMallData();
          // this.getMallMerchantItemsByCountry();
        })
        .catch((error) => {
          // eslint-disable-next-line
          throw error;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getCityMall() {
      this.isLoading = true;

      // Reset cities for all countries before making the API request
      this.country.forEach((item, index) => {
        this.country[index].cities = [];
      });

      axios
        .get(
          `/app-city-list/${this.$appId}/${this.itemSelectedComplete?.id || 1}`,
        )
        .then((response) => {
          const data = response.data.data;

          let selectedIndex = this.country.findIndex(
            (item) => item.id === this.itemSelectedComplete?.id,
          );

          if (selectedIndex !== -1 && selectedIndex !== 0) {
            // Hapus item dari posisi saat ini
            let selectedItem = this.country.splice(selectedIndex, 1)[0];
            // Sisipkan item ke indeks pertama
            this.country.unshift(selectedItem);
          }

          this.city = data.map((city) => {
            return {
              id: city.city_id,
              title: city.city_name,
              count: city.property_count,
              image: city?.city_image || "",
              countryId: city.country_id,
              path: "#",
            };
          });

          let index = this.country.findIndex(
            (item) => item.id === this.itemSelectedComplete?.id,
          );

          if (index !== -1 && this.country[index].oneCity === false) {
            this.country[index].cities = this.city;
          }
          // console.log(this.country);
        })
        .catch((error) => {
          throw error;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    changeItemSelected(item) {
      this.setItemSelected(item.title);
      this.selectedPlace = item.title;
      this.setItemSelectedComplete(item);
      localStorage.setItem("mallCount", this.itemSelectedComplete?.count);
      this.setItemSelected2("---Select City---");
      this.setItemSelected2Complete(null);
      this.getCityMall();
      // this.getActiveMallData();
      app.config.globalProperties.$eventBus.$emit("getActiveDataByCountryCity");
      this.dialog = false;
    },
    changeItemSelected2(item) {
      this.setItemSelected2(item.title);
      this.selectedPlace = item.title;
      this.setItemSelected2Complete(item);
      app.config.globalProperties.$eventBus.$emit("getActiveDataByCountryCity");
      this.dialog = false;
    },
    goToPath(data) {
      this.setSelectedTrending(data);
      this.$router.push(data.to);
    },
    getTrendings() {
      axios
        .get(`/list-main-categories`)
        .then((response) => {
          const data = response.data.data;
          this.trendings = data
            .sort((a, b) => a.category_id < b.category_id)
            .map((item) => ({
              ...item,
              icon: item.icon_image,
              title: item.category_name,
              to: item.link_name.includes("asdf")
                ? "/buy"
                : item.link_name.includes("roomates")
                  ? "/roommates"
                  : item.link_name.split("https://4walls.sg")[1],
            }));
        })
        .catch((error) => {
          // eslint-disable-next-line
          throw error;
        });
    },
  },

  mounted() {
    const token = localStorage.getItem("token");
    this.getCountryMall();
    if (this.tokenProvider != null) {
      this.getHeaderUserData();
    } else if (token) {
      this.getHeaderUserData();
    }
    this.getLogo();

    this.getTrendings();

    app.config.globalProperties.$eventBus.$on(
      "getTokenStart",
      this.getTokenStart,
    );
    app.config.globalProperties.$eventBus.$on(
      "getHeaderUserData",
      this.getHeaderUserData,
    );
    app.config.globalProperties.$eventBus.$on("openSearch", this.openSearch);
    app.config.globalProperties.$eventBus.$on(
      "changeHeaderImage",
      this.changeHeaderImage,
    );
    app.config.globalProperties.$eventBus.$on(
      "changeHeaderWelcome2",
      this.changeHeaderWelcome2,
    );
    app.config.globalProperties.$eventBus.$on(
      "changeHeaderWelcome3",
      this.changeHeaderWelcome3,
    );

    // this.isTrending = this.$route.name.includes("Trending");
  },
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
          :src="$fileURL + logo"
          :lazy-src="`${$fileURL}${logo}`"
          height="50"
          eager
          transition="fade-transition"
        >
          <template #placeholder>
            <v-skeleton-loader type="image"></v-skeleton-loader>
          </template>
        </v-img>
      </div>
    </router-link>

    <div
      v-if="
        !isHeader &&
        !isProfile &&
        !isBatamProperties &&
        !(
          $route.name == 'Trending-buy' ||
          $route.name == 'Trending-rent' ||
          $route.name == 'Trending-roommates' ||
          $route.name == 'Trending-staycation' ||
          $route.name == 'Trending-vacation' ||
          $route.name == 'Trending-co-living' ||
          $route.name == 'Trending-co-working'
        )
      "
      class="text-center desktop__app"
    >
      <v-btn
        style="background: #f4f5f7; color: black"
        variant="text"
        color="black"
        icon="mdi-share-outline"
        width="40"
        height="40"
        class="mr-2"
      >
        <v-icon color="rgb(38, 38, 38)" size="22"> mdi-share-outline </v-icon>
        <v-menu activator="parent">
          <v-list>
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
                <v-icon class="mr-4" color="black" size="18">
                  mdi-twitter </v-icon
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
      </v-btn>
    </div>

    <data
      v-if="
        $route.name == 'Trending-buy' ||
        $route.name == 'Trending-rent' ||
        $route.name == 'Trending-roommates' ||
        $route.name == 'Trending-staycation' ||
        $route.name == 'Trending-vacation' ||
        $route.name == 'Trending-co-living' ||
        $route.name == 'Trending-co-working'
      "
      class="d-flex align-center ga-4"
    >
      <div
        class="d-none d-md-block text-h5 font-weight-black text-no-wrap text-red-darken-4"
        style="text-transform: capitalize !important"
      >
        {{ $route.path.replaceAll("-", " ").replaceAll("/", "") }}
      </div>
    </data>

    <!-- <v-btn
      v-if="
        !isSmall &&
        ($route.name == 'Trending-buy' ||
          $route.name == 'Trending-rent' ||
          $route.name == 'Trending-roommates' ||
          $route.name == 'Trending-staycation' ||
          $route.name == 'Trending-vacation' ||
          $route.name == 'Trending-co-living' ||
          $route.name == 'Trending-co-working')
      "
      style="font-size: 15px; color: #494949"
      variant="text"
      :disabled="isLoading"
      @click="dialog = true"
    >
      <template v-if="!itemSelectedComplete || itemSelectedComplete == null">
        <span>{{ selectedPlace || itemSelected }}</span>
      </template>
      <template v-if="itemSelectedComplete || itemSelectedComplete != null">
        <div style="border-radius: 50%; height: 20px; width: 20px">
          <v-img :src="$fileURL + itemSelectedComplete?.flag"></v-img>
          <v-img
            style="
              width: 100% !important;
              height: 20px !important;
              object-fit: cover !important;
              object-position: center !important;
            "
            :src="$fileURL + itemSelectedComplete?.flag"
          />
        </div>
        <span class="ml-2">{{
          selectedPlace || itemSelectedComplete?.title
        }}</span>
      </template>
      <v-icon right dark> mdi-menu-down </v-icon>
    </v-btn> -->

    <v-menu v-model="userLocation" :close-on-content-click="false">
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
          {{ selectedPlace }}
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-card-title>
          <div class="d-flex align-center ga-2">
            <v-icon size="small">mdi-map-marker</v-icon>
            <p class="text-subtitle-2">Choose Your Location</p>
          </div>
        </v-card-title>

        <v-list>
          <v-list-subheader>
            <div class="d-flex align-center ga-2">
              <v-avatar
                :image="$fileURL + itemSelectedComplete?.flag"
                size="x-small"
              ></v-avatar>
              <p class="text-subtitle-1 font-weight-medium">Singapore</p>
            </div>
          </v-list-subheader>

          <v-list-item value="jakarta" variant="plain">
            <v-list-item-title>
              <p class="ml-7">Jakarta</p>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <!-- <v-btn
      v-if="
        !isSmall &&
        ($route.name == 'Trending-buy' ||
          $route.name == 'Trending-rent' ||
          $route.name == 'Trending-roommates' ||
          $route.name == 'Trending-staycation' ||
          $route.name == 'Trending-vacation' ||
          $route.name == 'Trending-co-living' ||
          $route.name == 'Trending-co-working')
      "
      style="font-size: 15px; color: #494949"
      variant="text"
      :disabled="isLoading"
      @click="dialog = true"
    >
      <template v-if="!itemSelectedComplete || itemSelectedComplete == null">
        <span>{{ selectedPlace || itemSelected }}</span>
      </template>
      <template v-if="itemSelectedComplete || itemSelectedComplete != null">
        <div style="border-radius: 50%; height: 20px; width: 20px">
          <v-img :src="$fileURL + itemSelectedComplete?.flag"></v-img>
          <v-img
            style="
              width: 100% !important;
              height: 20px !important;
              object-fit: cover !important;
              object-position: center !important;
            "
            :src="$fileURL + itemSelectedComplete?.flag"
          />
        </div>
        <span class="ml-2">{{
          selectedPlace || itemSelectedComplete?.title
        }}</span>
      </template>
      <v-icon right dark> mdi-menu-down </v-icon>
    </v-btn> -->

    <div
      v-if="isHeader || isProfile"
      class="ml-6 d-flex flex-row navbar-header"
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
        item-title="name"
        item-value="name"
        :items="activeMalls"
        style="font-style: italic"
        placeholder="Explore Properties"
        density="compact"
        color="blue-grey-lighten-2"
      >
        <template #item="{ props, item }">
          <div class="mb-2" v-bind="props">
            <router-link
              class="text-decoration-none text-black font-weight-bold"
              to="#"
            >
              <div class="d-flex align-center w-100">
                <div class="w-25 py-1">
                  <div style="width: 60px">
                    <v-img height="40" :src="item?.raw?.mainImage">
                      <template #placeholder>
                        <v-skeleton-loader type="image"></v-skeleton-loader>
                      </template>
                    </v-img>
                  </div>
                </div>
                <div class="w-75" style="font-size: 12px">
                  <p class="mb-1">
                    {{ `${item?.raw?.name} (${item?.raw?.subIndustryName})` }}
                  </p>
                  <p class="text-grey">
                    <span>{{ `${item?.raw?.town}` }}</span> (<span
                      class="text-red"
                      >{{ `${item?.raw?.distanceText}` }}</span
                    ><span class="text-black"> away</span>)
                  </p>
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

    <div v-if="isBatamProperties" class="d-none d-md-flex ga-2 w-100">
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
    </div>

    <div v-if="!isHeader && !isProfile && !userName" class="btn_sign__up-cont">
      <v-btn elevation="0" class="btn_sign__up" to="/sign-in">
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
        src="@/assets/images/icons/user_icon.png"
        cover
        height="48"
        style="height: 100%; width: 100%"
      />
    </div>

    <template v-if="!isProfile" #extension>
      <div class="mobile__app text-center w-100">
        <template
          v-if="
            $route.name == 'Trending-buy' ||
            $route.name == 'Trending-rent' ||
            $route.name == 'Trending-roommates' ||
            $route.name == 'Trending-staycation' ||
            $route.name == 'Trending-vacation' ||
            $route.name == 'Trending-co-living' ||
            $route.name == 'Trending-co-working'
          "
        >
          <div class="d-flex justify-center mx-auto" style="width: max-content">
            <v-btn
              v-if="
                isSmall &&
                ($route.name == 'Trending-buy' ||
                  $route.name == 'Trending-rent' ||
                  $route.name == 'Trending-roommates' ||
                  $route.name == 'Trending-staycation' ||
                  $route.name == 'Trending-vacation' ||
                  $route.name == 'Trending-co-living' ||
                  $route.name == 'Trending-co-working')
              "
              style="font-size: 15px; color: #494949"
              variant="text"
              :disabled="isLoading"
              @click="dialog = true"
            >
              <template
                v-if="!itemSelectedComplete || itemSelectedComplete == null"
              >
                <span>{{ selectedPlace || itemSelected }}</span>
              </template>
              <template
                v-if="itemSelectedComplete || itemSelectedComplete != null"
              >
                <div style="border-radius: 50%; height: 20px; width: 20px">
                  <v-img
                    style="
                      width: 100% !important;
                      height: 20px !important;
                      object-fit: cover !important;
                      object-position: center !important;
                    "
                    :src="$fileURL + itemSelectedComplete?.flag"
                  />
                </div>
                <span class="ml-2">{{
                  selectedPlace || itemSelectedComplete?.title
                }}</span>
              </template>
              <v-icon right dark> mdi-menu-down </v-icon>
            </v-btn>
          </div>
        </template>

        <form class="navbar__search navbar__search__mobile mx-auto">
          <v-autocomplete
            id="product_name"
            v-model="search"
            class="form-control mr-sm-2 ml-md-n3 search-input"
            item-title="name"
            item-value="name"
            :items="activeMalls"
            style="font-style: italic"
            placeholder="Explore Properties"
            density="compact"
            color="blue-grey-lighten-2"
          >
            <template #item="{ props, item }">
              <div class="mb-2" v-bind="props">
                <router-link
                  class="text-decoration-none text-black font-weight-bold"
                  style="font-size: 12px"
                  to="#"
                >
                  <div class="d-flex align-center" style="width: 100%">
                    <div style="width: 30% !important" class="py-1">
                      <div style="width: 100px">
                        <v-img height="40" :src="item?.raw?.mainImage">
                          <template #placeholder>
                            <v-skeleton-loader type="image"></v-skeleton-loader>
                          </template>
                        </v-img>
                      </div>
                    </div>
                    <div style="width: 70% !important" class="pl-2">
                      <p class="mb-1">
                        {{
                          `${item?.raw?.name} (${item?.raw?.subIndustryName})`
                        }}
                      </p>
                      <p class="text-grey">
                        <span>{{ `${item?.raw?.town}` }}</span> (<span
                          class="text-red"
                          >{{ `${item?.raw?.distanceText}` }}</span
                        ><span class="text-black"> away</span>)
                      </p>
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
          style="max-width: 1200px; overflow-x: auto"
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

  <v-navigation-drawer
    v-if="isSmall"
    v-model="drawer"
    temporary
    location="right"
  >
    <div
      class="drawer__top"
      :class="{ 'py-6': userName == null, 'py-2': userName != null }"
    >
      <router-link
        v-if="userName == null"
        class="text-decoration-none"
        to="/sign-in"
      >
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
        <v-img height="35" width="80" :src="$fileURL + logo" />
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
          <v-img height="20" width="30" src="@/assets/images/icons/home.png" />
        </div>
        <v-list-item-title style="font-size: 12px"> Home </v-list-item-title>
      </li>

      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img
            height="18"
            width="25"
            src="@/assets/images/icons/menu-shopper.png"
          />
        </div>
        <router-link class="text-decoration-none text-black" to="/my-profile">
          <v-list-item-title style="font-size: 12px">
            My Profile
          </v-list-item-title>
        </router-link>
      </li>

      <li class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img height="18" width="25" src="@/assets/images/icons/shop.png" />
        </div>
        <v-list-item-title style="font-size: 12px">
          My Cartr
        </v-list-item-title>
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
              <v-img
                src="@/assets/images/icons/facebook.png"
                height="40"
                width="32"
              />
            </a>
          </v-col>
          <v-col class="d-flex justify-center" cols="3">
            <a :href="contactData?.instagram">
              <v-img
                src="@/assets/images/icons/insta.png"
                height="40"
                width="32"
              />
            </a>
          </v-col>
          <v-col class="d-flex justify-start" cols="3">
            <a :href="contactData?.tiktok">
              <v-img
                src="@/assets/images/icons/tiktok.png"
                class="mt-1"
                height="35"
                width="35"
              />
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
                src="@/assets/whatsapp.svg"
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

  <!-- <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    height="100vh"
    class="mt-16"
    z-index="1000000"
  >
    <v-card
      height="90vh"
      class="mt-16"
      style="border-top-left-radius: 30px; border-top-right-radius: 30px"
      prepend-icon="mdi-map-marker"
    >
      <template #title>
        <span class="font-weight-bold" style="font-size: 18px"
          >Choose your location</span
        >
      </template>
      <template #append>
        <v-btn
          variant="text"
          icon="mdi-close"
          text="Ok"
          @click="dialog = false"
        />
      </template>
      <v-card-text class="px-4" style="height: 100px">
        <div v-for="item in country" :key="item.id">
          <div
            v-if="item.count > 0"
            class="d-flex mb-6 align-content-center"
            @click="changeItemSelected(item)"
          >
            <div class="w15">
              <v-img height="20" width="30" :src="$fileURL + item?.flag" />
            </div>
            <div class="d-flex justify-space-between w85">
              <p style="font-size: 14px !important">
                <span
                  :class="{
                    'font-weight-bold': item.title == selectedPlace,
                  }"
                  >{{ item.title }}</span
                >
                (
                <span class="text-blue-darken-4"
                  >{{ item.count }}
                  {{
                    item?.count == "1" || item?.count == "0"
                      ? "Property"
                      : "Properties"
                  }}</span
                >
                )
              </p>

              <v-icon v-if="item.title == selectedPlace" color="green">
                mdi-check-circle
              </v-icon>
            </div>
          </div>

          <div
            v-for="data in item.cities"
            :key="data.id"
            @click="changeItemSelected2(data)"
          >
            <div v-if="data.count > 0" class="d-flex mb-6 align-content-center">
              <div class="w15" />
              <div class="w85 d-flex justify-space-between">
                <p style="font-size: 14px !important">
                  <span
                    :class="{
                      'font-weight-bold': data.title == selectedPlace,
                    }"
                    >{{ data.title }}</span
                  >
                  (
                  <span class="text-blue-darken-4"
                    >{{ data.count }}
                    {{
                      data?.count == "1" || data?.count == "0"
                        ? "Property"
                        : "Properties"
                    }}</span
                  >
                  )
                </p>
                <v-icon v-if="data.title == selectedPlace" color="green">
                  mdi-check-circle
                </v-icon>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog> -->

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
  /* set to whatever value suits your needs */
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
</style>
