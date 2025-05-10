<template>
  <div>
    <div v-if="isLoading" class="text-center loading-page">
      <v-progress-circular :size="50" color="primary" indeterminate />
    </div>
    <div v-if="!isLoading" class="pt-16" :class="{ 'mt-8': !isSmall }">
      <v-container>
        <div v-for="i in 9" :key="i" :class="{ 'w-75': !isSmall }">
          <h3
            v-if="privacyData['header_' + i]"
            :class="{ 'ml-5': !privacyData['header_' + i][0].match(/^\d/) }"
            class="my-4"
          >
            {{ privacyData["header_" + i] }}
          </h3>

          <p
            v-if="privacyData['info_' + i]"
            class="ml-5"
            v-html="formatInfo(privacyData['info_' + i])"
          />
        </div>
      </v-container>
      <v-divider class="my-4" />
      <Footer :header-data="headerData" :footer-data="footerData" />
    </div>
  </div>
</template>
<script setup>
import Footer from "@/components/Footer.vue";
import axios from "@/util/axios";
</script>
<script>
export default {
  name: "App",
  data() {
    return {
      drawer: false,
      privacyData: {},
      footerData: {},
      isLoading: false,
      screenWidth: window.innerWidth,
    };
  },
  computed: {
    privacyType() {
      return this.$route.path == "/privacy-policy" ? "P" : "T";
    },
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  watch: {
    privacyType() {
      this.getPrivacyData();
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    this.getPrivacyData();
    this.getFooterData();
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    formatInfo(info) {
      return info.replace(/\n/g, "<br>");
    },
    getPrivacyData() {
      this.isLoading = true;
      axios
        .get(`/privacy-policy/type/${this.privacyType}`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.privacyData = data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getFooterData() {
      this.isLoading = true;
      axios
        .get(`/footer`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data[0]);
          this.footerData = data[0];
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
  },
};
</script>

<style lang="scss" scoped></style>
