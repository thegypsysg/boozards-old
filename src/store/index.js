// store.js
// import { createStore } from "vuex";
import { createStore } from "vuex";
import axios from "@/util/axios";
import { showSnackbar } from "@/composables/useGlobalSnackbar";

const authToken = localStorage.getItem("token");

export default (app) =>
  createStore({
    state: {
      activeTag: null, // Tag yang aktif
      itemSelected: "---Select Country---",
      itemSelectedComplete: null,
      itemSelected2: "---Select City---",
      itemSelected2Complete: null,
      selectedTrending: "",
      selectedCountry: "Test",
      latitude: "",
      longitude: "",
      country: [],
      selectedPlace: "",
      activeCity: null,
      footerData: null,
      appDetails: null,
      categoryData: null,
      cart: [],
      selectedDelivery: null,
      detailsCart: [],
      isEmptyCart: true,
      totalCartItems: 0,
      isLoading: false,
      deliveryCharges: [],
      paymentOptions: [],
      isNotLoggedIn: false,
      isCartEmpty: false,
      isCountryUpdating: false,
      isEmptyDelivery: false,
      userName: localStorage.getItem("username"),
    },
    mutations: {
      deliveryCharges(state, data) {
        state.deliveryCharges = data;
      },
      paymentOptions(state, data) {
        state.paymentOptions = data;
      },
      isLoading(state, data) {
        state.isLoading = data;
      },
      setIsNotLoggedIn(state, data) {
        state.isNotLoggedIn = data;
      },
      setIsCartEmpty(state, data) {
        state.isCartEmpty = data;
      },
      setIsCountryUpdating(state, data) {
        state.isCountryUpdating = data;
      },
      setIsEmptyDelivery(state, data) {
        state.isEmptyDelivery = data;
      },
      cart(state, data) {
        state.cart = data;
      },
      selectedDelivery(state, data) {
        state.selectedDelivery = data;
      },
      isEmptyCart(state, data) {
        state.isEmptyCart = data;
      },
      totalCartItems(state, data) {
        state.totalCartItems = data;
      },
      detailsCart(state, data) {
        state.detailsCart = data;
      },
      setActiveTag(state, tag) {
        state.activeTag = tag; // Memperbarui tag yang aktif
      },

      setSelectedCountry(state, item) {
        state.selectedCountry = item;
      },
      setItemSelected(state, item) {
        state.itemSelected = item; // Memperbarui tag yang aktif
      },
      setItemSelectedComplete(state, item) {
        state.itemSelectedComplete = item; // Memperbarui tag yang aktif
      },
      setItemSelected2(state, item) {
        state.itemSelected2 = item; // Memperbarui tag yang aktif
      },
      setItemSelected2Complete(state, item) {
        state.itemSelected2Complete = item; // Memperbarui tag yang aktif
      },
      setSelectedTrending(state, item) {
        state.selectedTrending = item;
      },
      setCountry(state, item) {
        state.country = item;
      },
      setLongLat(state, item) {
        state.latitude = item.latitude;
        state.longitude = item.longitude;
      },
      setActiveCity(state, item) {
        state.activeCity = item;
      },
      setSelectedPlace(state, item) {
        state.selectedPlace = item;
      },
      setFooterData(state, item) {
        state.footerData = item;
      },
      setAppDetails(state, item) {
        state.appDetails = item;
      },
      setCategoryData(state, item) {
        state.categoryData = item;
      },
      clearCart(state) {
        state.cart = [];
        localStorage.removeItem("cart");
      },
      setUserName(state, data) {
        state.userName = data;
      },
    },
    actions: {
      async getDeliveryCharges({ commit, state }, countryId) {
        await axios
          .post(
            `/delivery-charges-list-by-country`,
            { country_id: countryId, app_id: 3 },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          )
          .then((response) => {
            if (response?.data.length > 0) {
              commit("isEmptyCart", false);
            }
            commit("deliveryCharges", response?.data?.data);
          })
          .catch((error) => {
            console.log(error);
            // state.errorCart = error?.error;
            // showSnackbar(error?.response?.data?.error, "error");
          });
      },

      async updateDeliveryChargesInCart({ commit, state }, data) {
        await axios
          .put(`/update-delivery-charges-in-cart`, data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            localStorage.setItem("selectedDelivery", data?.dc_id);
            commit("selectedDelivery", data?.dc_id);
            // commit("cart", response?.data?.data);
          })
          .catch((error) => {
            console.log(error);
            // state.errorCart = error?.error;
            // showSnackbar(error?.response?.data?.error, "error");
          });
      },

      async getCartItems({ commit, state }) {
        await axios
          .get(`/get-cart-items`, null, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            if (response?.data.length > 0) {
              commit("isEmptyCart", false);
            }
            commit("cart", response?.data);
            commit("totalCartItems", response?.data.length);
          })
          .catch((error) => {
            console.log(error);
            // state.errorCart = error?.error;
            // showSnackbar(error?.response?.data?.error, "error");
          });
      },

      async addToCart({ commit, state }, data) {
        commit("isLoading", true);
        await axios
          .post(`/add-to-cart`, data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            axios
              .get(`/get-cart-items`, null, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then((response) => {
                if (response?.data.length > 0) {
                  commit("isEmptyCart", false);
                }
                commit("cart", response?.data);
                commit("totalCartItems", response?.data.length);
                commit("isLoading", false);
              })
              .catch((error) => {
                console.log(error);
                // state.errorCart = error?.error;
                // showSnackbar(error?.response?.data?.error, "error");
                commit("isLoading", false);
              });
          })
          .catch((error) => {
            console.log(error);
            // state.errorCart = error?.error;
            // showSnackbar(error?.response?.data?.error, "error");
            commit("isLoading", false);
          });
      },

      async updateCart({ commit, state }, product) {
        commit("isLoading", true);
        // console.log("updateCart", product);
        await axios
          .put(`/update-cart`, product, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then(() => {
            axios
              .get(`/get-cart-items`, null, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then((response) => {
                if (response?.data.length > 0) {
                  commit("isEmptyCart", false);
                }
                commit("cart", response?.data);
                commit("totalCartItems", response?.data.length);
                commit("isLoading", false);
              })
              .catch((error) => {
                console.log(error);
                // state.errorCart = error?.error;
                // showSnackbar(error?.response?.data?.error, "error");
                commit("isLoading", false);
              });
          })
          .catch((error) => {
            state.errorCart = error?.response?.data;
          });
      },

      async removeFromCart({ commit, state }, product) {
        commit("isLoading", true);
        // console.log("removeFromCart", product);
        await axios
          .post(
            `/remove-cart-item`,
            { cart_id: product.cart_id, range_id: product.range_id },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          )
          .then((response) => {
            // this.getCartItems();

            axios
              .get(`/get-cart-items`, null, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then((response) => {
                if (response?.data.length > 0) {
                  commit("isEmptyCart", false);
                }
                commit("cart", response?.data);
                commit("totalCartItems", response?.data.length);
                commit("isLoading", false);
              })
              .catch((error) => {
                console.log(error);
                // state.errorCart = error?.error;
                // showSnackbar(error?.response?.data?.error, "error");
                commit("isLoading", false);
              });
          })
          .catch((error) => {
            state.errorCart = error;
            commit("isLoading", false);
          });
        // commit('removeFromCart', data);
      },

      async getLongLat({ commit }) {
        if (navigator.geolocation) {
          try {
            navigator.geolocation.getCurrentPosition((position) => {
              if (position) {
                localStorage.setItem("latitude", position.coords.latitude);
                localStorage.setItem("longitude", position.coords.longitude);
                commit("setLongLat", {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              }
            });
          } catch (error) {
            throw error;
          }
        }
      },

      async setDefaultCountry({ commit, state, dispatch }) {
        if (state.latitude && state.longitude) {
          let link = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${state.latitude}&lon=${state.longitude}`;

          try {
            const dataCountry = await axios.get(link);

            if (dataCountry.data.address) {
              let country = dataCountry.data.address.country;
              localStorage.setItem("countryDevice", country);

              const currentLocation = state.country.find(
                (data) => data.country_name === country,
              );

              commit(
                "setItemSelectedComplete",
                currentLocation ? currentLocation : state.country[0],
              );

              localStorage.setItem(
                "mallCount",
                currentLocation.count
                  ? currentLocation.count
                  : state.country[0].count,
              );

              commit(
                "setItemSelected",
                currentLocation
                  ? currentLocation.title
                  : state.country[0].title,
              );

              commit(
                "setSelectedPlace",
                currentLocation
                  ? currentLocation.title
                  : state.country[0].title,
              );
            }
          } catch (error) {
            throw error;
          }
        } else {
          try {
            await dispatch("getLongLat");

            let link = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${state.latitude}&lon=${state.longitude}`;

            const dataCountry = await axios.get(link);

            if (dataCountry.data.address) {
              let country = dataCountry.data.address.country;
              localStorage.setItem("countryDevice", country);

              const currentLocation = state.country.find(
                (data) => data.country_name === country,
              );

              commit(
                "setItemSelectedComplete",
                currentLocation ? currentLocation : state.country[0],
              );

              localStorage.setItem(
                "mallCount",
                currentLocation.count
                  ? currentLocation.count
                  : state.country[0].count,
              );

              commit(
                "setItemSelected",
                currentLocation
                  ? currentLocation.title
                  : state.country[0].title,
              );

              commit(
                "setSelectedPlace",
                currentLocation
                  ? currentLocation.title
                  : state.country[0].title,
              );
            }
          } catch (error) {
            throw error;
          }
        }
      },

      async getCityMall({ commit, dispatch, state }) {
        let link = `/app-city-list/${app.config.globalProperties.$appId}`;

        try {
          const { data } = await axios.get(link);

          let filtering = state.country.map((item) => {
            let obj = {
              ...item,
              cities: [],
            };

            obj.cities = data.data.filter(
              (city) => city.country_id === item.id,
            );

            return obj;
          });

          state.country = filtering.filter(
            (dataCountry) => dataCountry.cities.length > 0,
          );

          let getCountry = state.country.find(
            (country) => country.title === state.selectedPlace,
          );

          if (!state.activeCity && getCountry?.cities.length > 0) {
            this.activeCity = getCountry.cities[0];

            commit("setActiveCity", getCountry.cities[0]);
          }
        } catch (error) {}
      },
      async getCountryMall({ commit, dispatch }) {
        let link = `/app-country-list/${app.config.globalProperties.$appId}`;

        try {
          await dispatch("getLongLat");

          const { data } = await axios.get(link);

          let allCountry = data.data.map((country) => {
            let obj = {
              ...country,
              id: country.country_id,
              title: country.country_name,
              count: country.property_count,
              oneCity: country.one_city == "Y" ? true : false,
              path: "#",
              flag: country.flag,
              cities: [],
            };

            return obj;
          });

          commit("setCountry", allCountry);

          await dispatch("setDefaultCountry");

          await dispatch("getCityMall");
        } catch (error) {
          throw error;
        }
      },
      clearCart({ commit }) {
        commit("clearCart");
      },
    },
    getters: {
      cartItems: (state) => state.cart,
      cartTotal: (state) =>
        state.cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
    },
  });
