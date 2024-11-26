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
    </div>
  </v-app>
</template>

<script>
import { RouterView } from "vue-router";
import Header from "@/components/Header.vue";
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
      } else if (this.currentRoute === "/sign-in") {
        title = "Sign-Up / Sign-in";
      } else if (this.currentRoute === "/social-sign-up") {
        title = "Social Registration";
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
        this.currentRoute === "/sign-in" ||
        this.currentRoute === "/social-sign-up"
      );
    },
    isBatamProperties() {
      return this.currentRoute === "/batam-properties";
    },
    isSignIn() {
      return (
        this.currentRoute === "/sign-in" ||
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
              this.$router.push(`/${data.slug}`);
              app.config.globalProperties.$eventBus.$emit(
                "getTrendingCardData2",
              );
            } else if (data == null) {
              app.config.globalProperties.$eventBus.$emit(
                "changeHeaderPath",
                "/",
              );
            }

            if (data.slug) {
              this.path = `/${data.slug}`;
              app.config.globalProperties.$eventBus.$emit(
                "changeHeaderPath",
                `/${data.slug}`,
              );
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
