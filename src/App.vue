<template>
  <v-app>
    <div>
      <Header
        v-if="$route.name != 'Buy Studio' && $route.name != 'Buy Detail'"
        :isHeader="
          currentRoute === '/discount-types' ||
          currentRoute === '/category' ||
          currentRoute === '/meal-promo' ||
          currentRoute === '/people-promo' ||
          currentRoute === '/preference-promo' ||
          currentRoute === '/others-promo' ||
          currentRoute === '/day-promo' ||
          currentRoute.includes('redeem') ||
          currentRoute.includes('event') ||
          currentRoute.includes('parking-info') ||
          currentRoute.includes('mall-offers') ||
          currentRoute.includes('promo-detail') ||
          currentRoute.includes('mall-id') ||
          currentRoute.includes('level-id') ||
          currentRoute.includes('merchant-id') ||
          (currentRoute === '/all-merchants' && !isDesktop) ||
          (currentRoute === '/all-promotions' && !isDesktop) ||
          (currentRoute === '/all-events' && !isDesktop) ||
          (currentRoute === '/all-parking-info' && !isDesktop) ||
          (currentRoute === '/all-mall-offers' && !isDesktop) ||
          (currentRoute === '/all-malls' && !isDesktop)
            ? true
            : false
        "
        :title-header="titleHeader"
        :is-desktop="isDesktop"
        :is-profile="isProfile"
        :isBatamProperties="isBatamProperties"
        :is-signin="isSignIn"
      />
      <RouterView v-slot="{ Component }">
        <Transition name="page-opacity" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
      <FooterMobile v-show="!isDesktop && !isProfile"></FooterMobile>
    </div>
    <v-dialog v-model="isLoggedIn" persistent width="auto">
      <v-card width="350">
        <v-card-text class="">
          <h4 class="mt-4 mb-8 text-center">
            Please Sign Up or Login to proceed with Adding Items to your Cart
          </h4>
          <v-btn class="mb-4 w-100 bg-primary" @click="closeIsLoggedIn">
            OK
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isCartEmpty" persistent width="auto">
      <v-card width="350">
        <v-card-text class="">
          <h4 class="mt-4 mb-8 text-center">
            Your Cart is Empty . Please add products in your cart first
          </h4>
          <v-btn class="mb-4 w-100 bg-primary" @click="closeIsCartEmpty">
            OK
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isCountryUpdating" persistent width="auto">
      <v-card width="350">
        <v-card-text class="">
          <h4 class="mt-4 mb-8 text-center">
            We will be updating this very soon pls come back again
          </h4>
          <v-btn class="mb-4 w-100 bg-primary" @click="closeIsCountryUpdating">
            OK
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isEmptyDelivery" persistent width="auto">
      <v-card width="350">
        <v-card-text class="">
          <h4 class="mt-4 mb-8 text-center">Please select atleast 1 option</h4>
          <v-btn class="mb-4 w-100 bg-primary" @click="closeIsEmptyDelivery">
            OK
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { RouterView } from "vue-router";
import Header from "@/components/Header.vue";
import FooterMobile from "@/components/FooterMobile.vue";
import app from "@/util/eventBus";
import axios from "@/util/axios";

export default {
  name: "App",
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { RouterView, Header },
  data() {
    return {
      currentRoute: this.$route.path,
      isDesktop: true,
      token: null,
    };
  },
  computed: {
    titleHeader() {
      let title = "";
      if (this.currentRoute === "/my-profile") {
        title = "My Profile";
      } else if (this.currentRoute === "/my-favorites") {
        title = "My Favorites";
      } else if (this.currentRoute === "/checkout") {
        title = "Checkout";
      } else if (this.currentRoute === "/price-list") {
        title = "Price List";
      } else if (this.currentRoute === "/sign-in") {
        title = "Sign-Up / Sign-in";
      } else if (this.currentRoute === "/social-sign-up") {
        title = "Social Registration";
      } else if (this.currentRoute === "/sign-up-email") {
        title = "Email Registration";
      } else if (this.currentRoute === "/discount-types") {
        title = "Promotions by Discount";
      } else if (this.currentRoute === "/category") {
        title = "Promotions by Category";
      } else if (this.currentRoute === "/meal-promo") {
        title = "Promotions by Meals";
      } else if (this.currentRoute === "/people-promo") {
        title = "Promotions by People";
      } else if (this.currentRoute === "/preference-promo") {
        title = "Promotions by Preference";
      } else if (this.currentRoute === "/others-promo") {
        title = "Promotions by Others";
      } else if (this.currentRoute === "/day-promo") {
        title = "Promotions by Day";
      }
      return title;
    },
    isProfile() {
      return (
        this.currentRoute === "/my-profile" ||
        this.currentRoute === "/my-favorites" ||
        this.currentRoute === "/sign-in" ||
        this.currentRoute === "/social-sign-up" ||
        this.currentRoute === "/sign-up-email" ||
        this.currentRoute === "/price-list"
      );
    },
    isBatamProperties() {
      return this.currentRoute === "/batam-properties";
    },
    isSignIn() {
      return (
        this.currentRoute === "/sign-in" ||
        this.currentRoute === "/sign-up-email" ||
        this.currentRoute === "/social-sign-up"
      );
    },
  },
  watch: {
    $route: function () {
      this.currentRoute = this.$route.path;
    },
  },
  created() {
    const url = new URL(window.location.href);
    const tokenParam = url.searchParams.get("token");
    if (tokenParam) {
      localStorage.setItem("token", tokenParam);
    }

    this.getApplicant(tokenParam);
  },
  mounted() {
    this.isDesktop = window.innerWidth >= 768;
  },
  methods: {
    getApplicant(tokenParam) {
      this.isLoading = true;
      const token = localStorage.getItem("token");

      if (token || tokenParam)
        axios
          .get(`/gypsy-applicant`, {
            headers: {
              Authorization: `Bearer ${tokenParam ? tokenParam : token}`,
            },
          })
          .then((response) => {
            const data = response.data.data;

            if (data && data.basic_steps == null) {
              this.token = tokenParam ? tokenParam : token;
              app.config.globalProperties.$eventBus.$emit(
                "getTokenStart",
                tokenParam ? tokenParam : token,
              );
              localStorage.setItem("applicant_data", JSON.stringify(data));
            } else if (
              data &&
              data.basic_steps == "C" &&
              this.currentRoute == "/"
            ) {
              // this.$router.push(`/${data.slug}`);
              this.$router.push(`/`);
              app.config.globalProperties.$eventBus.$emit(
                "getTrendingCardData2",
              );
            } else if (data == null) {
              app.config.globalProperties.$eventBus.$emit(
                "changeHeaderPath",
                "/",
              );
            }

            if (data?.slug) {
              // this.path = `/${data.slug}`;
              this.path = `/`;
              app.config.globalProperties.$eventBus.$emit(
                "changeHeaderPath",
                `/`,
              );
              // app.config.globalProperties.$eventBus.$emit(
              //   "changeHeaderPath",
              //   `/${data.slug}`,
              // );
            } else {
              this.path = "/";
              app.config.globalProperties.$eventBus.$emit(
                "changeHeaderPath",
                "/",
              );
            }
            // else {
            //   app.config.globalProperties.$eventBus.$emit('getTrendingCardData2');
            // }
          })
          .catch((error) => {
            // eslint-disable-next-line
            throw error;

            // app.config.globalProperties.$eventBus.$emit('getTrendingCardData2');
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
  },
};
</script>

<script setup>
import { ref, watch, computed } from "vue"; // Ensure these are imported
import { useStore } from "vuex";

const store = useStore();

const isLoggedIn = ref(false);
const isCartEmpty = ref(false);
const isCountryUpdating = ref(false);
const isEmptyDelivery = ref(false);

const isNotLoggedIn = computed(() => store.state.isNotLoggedIn);
const isCartEmptyStore = computed(() => store.state.isCartEmpty);
const isCountryUpdatingStore = computed(() => store.state.isCountryUpdating);
const isEmptyDeliveryStore = computed(() => store.state.isEmptyDelivery);

const closeIsLoggedIn = () => {
  isLoggedIn.value = false;
  store.commit("setIsNotLoggedIn", false);
};

const closeIsCartEmpty = () => {
  isCartEmpty.value = false;
  store.commit("setIsCartEmpty", false);
};

const closeIsCountryUpdating = () => {
  isCountryUpdating.value = false;
  store.commit("setIsCountryUpdating", false);
};

const closeIsEmptyDelivery = () => {
  isEmptyDelivery.value = false;
  store.commit("setIsEmptyDelivery", false);
};

watch(isNotLoggedIn, (newX) => {
  if (newX == true) {
    isLoggedIn.value = true;
  }
});

watch(isCartEmptyStore, (newX) => {
  if (newX == true) {
    isCartEmpty.value = true;
  }
});

watch(isCountryUpdatingStore, (newX) => {
  if (newX == true) {
    isCountryUpdating.value = true;
  }
});

watch(isEmptyDeliveryStore, (newX) => {
  if (newX == true) {
    isEmptyDelivery.value = true;
  }
});
</script>

<style>
@import "@/assets/style/App.scss";

.page-opacity-enter-active,
.page-opacity-leave-active {
  transition: 400ms ease all;
}

.page-opacity-enter-from,
.page-opacity-leave-to {
  opacity: 0;
}
</style>
