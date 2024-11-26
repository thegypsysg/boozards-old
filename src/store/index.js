// store.js
// import { createStore } from "vuex";
import { createStore } from "vuex";
import axios from "@/util/axios";

export default (app) =>
  createStore({
    state: {
      activeTag: null, // Tag yang aktif
      itemSelected: "---Select Country---",
      itemSelectedComplete: null,
      itemSelected2: "---Select City---",
      itemSelected2Complete: null,
      selectedTrending: "",
      latitude: "",
      longitude: "",
      country: [],
      selectedPlace: "",
      activeCity: null,
    },
    mutations: {
      setActiveTag(state, tag) {
        state.activeTag = tag; // Memperbarui tag yang aktif
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
    },
    actions: {
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
    },
  });
