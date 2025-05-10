<template>
  <div>
    <div v-if="isLoading" class="text-center loading-page">
      <v-progress-circular :size="50" color="#fa2964" indeterminate />
    </div>
    <div v-if="!isLoading">
      <Main :isSmall="isSmall" />
    </div>
  </div>
</template>

<script setup>
import Happening from "./Happening/Happening.vue";
</script>

<script>
import { mapState, mapMutations } from "vuex";
import app from "@/util/eventBus";
import axios from "@/util/axios";
import Main from "../Main.vue";
export default {
  name: "DesktopView",
  components: { Happening },
  data() {
    return {
      drawer: false,
      isLoading: true,
      appDetails1: null,
      promo: [],
      country: [],
      promoCategory: [],
      promoMeals: [],
      promoPeople: [],
      promoPreference: [],
      promoOther: [],
      promoDays: [],
      promoVoucher: [],
      activeMallItems: [],
      activeMallCards: [],
      otherPromotionData: [],
      otherPromotionDataFinal: [],
      mallMerchants: [],
      mallPromotions: [],
    };
  },
  computed: {
    ...mapState(["itemSelectedComplete", "itemSelected2Complete"]),
    latitude() {
      return localStorage.getItem("latitude");
      // return 26.907524;
    },
    longitude() {
      return localStorage.getItem("longitude");
      // return 75.739639;
    },
    countryDevice() {
      return localStorage.getItem("countryDevice");
    },
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  mounted() {
    // this.getCountryMall();
    Promise.all([this.getAppDetails1()])
      .then(() => {
        this.isLoading = false;
      })
      .catch((error) => {
        this.isLoading = false;
      });
    app.config.globalProperties.$eventBus.$on(
      "getActiveDataByCountryCity",
      this.getActiveDataByCountryCity,
    );
  },
  beforeUnmount() {
    app.config.globalProperties.$eventBus.$off(
      "getActiveDataByCountryCity",
      this.getActiveDataByCountryCity,
    );
  },
  methods: {
    ...mapMutations([
      "setItemSelected",
      "setItemSelectedComplete",
      "setAppDetails",
    ]),
    getCountryMall() {
      this.isLoading = true;
      axios
        .get(`/app-cities/country-cities/${this.$appId}`)
        .then((response) => {
          const data = response.data.data;
          this.country = data.map((country) => {
            return {
              id: country.country_id,
              title: country.country_name,
              count: country?.mall_count || 0,
              // oneCity: country.one_city == "Y" ? true : false,
              path: "#",
              // flag: country.flag,
            };
          });
          // .log.log(this.country);
          const defaultCountry = data
            .filter((c) => c.country_name == this.countryDevice)
            .map((country) => {
              return {
                id: country.country_id,
                title: country.country_name,
                count: country?.mall_count || 0,
                // oneCity: country.one_city == "Y" ? true : false,
                path: "#",
                // flag: country.flag,
              };
            });
          // console.log("map country body", defaultCountry);
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
        })
        .catch((error) => {
          // eslint-disable-next-line
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getActiveDataByCountryCity() {
      this.getActiveMallData();
      this.getMallMerchantsData();
      this.getMallPromotionsData();
    },
    getAppDetails1() {
      axios
        .get(`/app/details/${this.$appId}`)
        .then((response) => {
          const data = response.data.data;
          this.setAppDetails(data[0]);
          // console.log(data);
          this.appDetails1 = data;
        })
        .catch((error) => {
          // eslint-disable-next-line
        });
    },
    getPromoDiscount() {
      axios
        .get(`/list-tags-by-tag-header/tag-header-short/DT`)
        .then((response) => {
          const data = response.data.data;

          this.promo = data.map((item) => {
            return {
              id: item.tag_id || 1,
              title: item.tag_name || "",
              img: this.$fileURL + item.tag_image || "",
              path: "",
              quantity: item.promotion_count || 0,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
        });
    },
    getPromoCategory() {
      axios
        .get(`/list-tags-by-tag-header/tag-header-short/CAT`)
        .then((response) => {
          const data = response.data.data;

          this.promoCategory = data.map((item) => {
            return {
              id: item.tag_id || 1,
              title: item.tag_name || "",
              img: this.$fileURL + item.tag_image || "",
              path: "",
              quantity: item.promotion_count || 0,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
        });
    },
    getPromoMeals() {
      axios
        .get(`/list-tags-by-tag-header/tag-header-short/MT`)
        .then((response) => {
          const data = response.data.data;

          this.promoMeals = data.map((item) => {
            return {
              id: item.tag_id || 1,
              title: item.tag_name || "",
              img: this.$fileURL + item.tag_image || "",
              path: "",
              quantity: item.promotion_count || 0,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line

          throw error;
        });
    },
    getPromoPeople() {
      axios
        .get(`/list-tags-by-tag-header/tag-header-short/PPLT`)
        .then((response) => {
          const data = response.data.data;

          this.promoPeople = data.map((item) => {
            return {
              id: item.tag_id || 1,
              title: item.tag_name || "",
              img: this.$fileURL + item.tag_image || "",
              path: "",
              quantity: item.promotion_count || 0,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line

          throw error;
        });
    },
    getPreferencePromo() {
      axios
        .get(`/list-tags-by-tag-header/tag-header-short/PT`)
        .then((response) => {
          const data = response.data.data;

          // let itemFinal = [];
          this.promoPreference = data.map((item) => {
            return {
              id: item.tag_id || 1,
              title: item.tag_name || "",
              img: this.$fileURL + item.tag_image || "",
              path: "",
              quantity: item.promotion_count || 0,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line

          throw error;
        });
    },
    getOtherPromo() {
      axios
        .get(`/list-tags-by-tag-header/tag-header-short/OPT`)
        .then((response) => {
          const data = response.data.data;

          // let itemFinal = [];
          this.promoOther = data.map((item) => {
            return {
              id: item.tag_id || 1,
              title: item.tag_name || "",
              img: this.$fileURL + item.tag_image || "",
              path: "",
              quantity: item.promotion_count || 0,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line

          throw error;
        });
    },
    getDaysPromo() {
      axios
        .get(`/list-tags-by-tag-header/tag-header-short/DAYST`)
        .then((response) => {
          const data = response.data.data;

          // let itemFinal = [];
          this.promoDays = data.map((item) => {
            return {
              id: item.tag_id || 1,
              title: item.tag_name || "",
              img: this.$fileURL + item.tag_image || "",
              path: "",
              quantity: item.promotion_count || 0,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line

          throw error;
        });
    },
    getVoucherPromo() {
      axios
        .get(`/list-tags-by-tag-header/tag-header-short/VT`)
        .then((response) => {
          const data = response.data.data;

          // let itemFinal = [];
          this.promoVoucher = data.map((item) => {
            return {
              id: item.tag_id || 1,
              title: item.tag_name || "",
              img: this.$fileURL + item.tag_image || "",
              path: "",
              quantity: item.promotion_count || 0,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line

          throw error;
        });
    },
    formatDistance(distance) {
      if (distance === 0 || distance === null) {
        return "0 km";
      } else {
        //const roundedDistance = Math.round(distance * 10) / 10;
        //const formattedDistance = roundedDistance.toLocaleString('en-US', {
        //  minimumFractionDigits: 1,
        //  maximumFractionDigits: 1,
        //});
        //return `${formattedDistance} km`;

        return distance.toFixed(1) + " kms";
      }
    },
    getActiveMallData() {
      // console.log("map country body", this.itemSelectedComplete);
      axios
        .get(
          this.itemSelectedComplete?.id != 1 && this.itemSelected2Complete?.id
            ? `/malls/active-list/${this.latitude}/${this.longitude}/featured/${
                this.itemSelectedComplete?.id || 1
              }/${this.itemSelected2Complete?.id || 1}`
            : this.itemSelectedComplete?.id == 1 &&
                !this.itemSelected2Complete?.id
              ? `/malls/active-list/${this.latitude}/${this.longitude}/featured/${
                  this.itemSelectedComplete?.id || 1
                }/1`
              : this.itemSelectedComplete?.id != 1 &&
                  !this.itemSelected2Complete?.id
                ? `/malls/active-list/${this.latitude}/${this.longitude}/featured/${
                    this.itemSelectedComplete?.id || 1
                  }`
                : `/malls/active-list/${this.latitude}/${this.longitude}/featured/1/1`,
        )
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          // let itemFinal = [];
          this.activeMallItems = data
            .sort((a, b) => a.distance - b.distance)
            .map((item) => item.partner_name);
          this.activeMallCards = data
            .sort((a, b) => a.distance - b.distance)
            .map((item) => {
              return {
                id: item.mall_id || 0,
                town: item.town_name || "",
                city: item.city_name || "",
                country: item.country_name || "",
                address:
                  item.town_name &&
                  item.city_name &&
                  item.country_name &&
                  item.one_city == "Y"
                    ? `${item.town_name}, ${item.city_name}`
                    : item.town_name &&
                        item.city_name &&
                        item.country_name &&
                        item.one_city != "Y"
                      ? `${item.town_name}, ${item.city_name}, ${item.country_name}`
                      : item.country_name &&
                          item.city_name &&
                          item.town_name == null
                        ? `${item.city_name}, ${item.country_name}`
                        : item.country_name &&
                            item.city_name == null &&
                            item.town_name == null
                          ? `${item.country_name}`
                          : item.city_name &&
                              item.country_name == null &&
                              item.town_name == null
                            ? `${item.city_name}`
                            : item.town_name &&
                                item.country_name == null &&
                                item.city_name == null
                              ? `${item.town_name}`
                              : "-",
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
          // console.log(this.activeMallCards);
        })
        .catch((error) => {
          // eslint-disable-next-line

          throw error;
        });
    },
    getMallMerchantsData() {
      axios
        // .get(
        //   `/mall-merchant-outlets/list-by-status/all/${this.latitude}/${this.longitude}`
        // )
        .get(
          this.itemSelectedComplete?.id != 1 && this.itemSelected2Complete?.id
            ? `/mall-merchant-outlets/list-by-status/all/${this.latitude}/${
                this.longitude
              }/${this.itemSelectedComplete?.id || 1}/${
                this.itemSelected2Complete?.id || 1
              }`
            : this.itemSelectedComplete?.id == 1 &&
                !this.itemSelected2Complete?.id
              ? `/mall-merchant-outlets/list-by-status/all/${this.latitude}/${
                  this.longitude
                }/${this.itemSelectedComplete?.id || 1}/1`
              : this.itemSelectedComplete?.id != 1 &&
                  !this.itemSelected2Complete?.id
                ? `/mall-merchant-outlets/list-by-status/all/${this.latitude}/${
                    this.longitude
                  }/${this.itemSelectedComplete?.id || 1}`
                : `/mall-merchant-outlets/list-by-status/all/${this.latitude}/${this.longitude}/1/1`,
        )
        .then((response) => {
          const data = response.data.data;
          this.mallMerchants = data.map((item) => {
            return {
              ...item,
              distanceText: this.formatDistance(parseInt(item.distance)),
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line

          throw error;
        });
    },
    getMallPromotionsData() {
      axios
        .get(
          this.itemSelectedComplete?.id != 1 && this.itemSelected2Complete?.id
            ? `/mall-promotions/featured/${this.latitude}/${this.longitude}/${
                this.itemSelectedComplete?.id || 1
              }/${this.itemSelected2Complete?.id || 1}`
            : this.itemSelectedComplete?.id == 1 &&
                !this.itemSelected2Complete?.id
              ? `/mall-promotions/featured/${this.latitude}/${this.longitude}/${
                  this.itemSelectedComplete?.id || 1
                }/1`
              : this.itemSelectedComplete?.id != 1 &&
                  !this.itemSelected2Complete?.id
                ? `/mall-promotions/featured/${this.latitude}/${this.longitude}/${
                    this.itemSelectedComplete?.id || 1
                  }`
                : `/mall-promotions/featured/${this.latitude}/${this.longitude}/1/1`,
        )
        .then((response) => {
          const data = response.data.data;
          this.mallPromotions = data.map((item) => {
            return {
              ...item,
              distanceText: this.formatDistance(parseInt(item.distance)),
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line

          throw error;
        });
    },
  },
};
</script>

<style>
.loading-page {
  height: 100vh;
  margin-top: 300px;
}

@media (max-width: 599px) {
  .loading-page {
    margin-top: 450px;
  }
}
</style>
