<template>
  <div class="mb-14 mt-md-10 mt-sm-2">
    <v-row>
      <v-col cols="12">
        <div>
          <!-- <p class="text-center" :class="isSmall ? 'text-caption' : undefined">
            <span class="mdi mdi-office-building-outline"></span> EXCLUSIVE
            LOCATIONS
          </p> -->
          <p
            align="center"
            class="header-title mt-4"
            :class="isSmall ? 'cust-title-2' : 'cust-title-1'"
          >
            Become Our Partner
          </p>
          <!-- <p class="text-center text-grey-darken-1 mx-16 mt-n4" :class="isSmall ? 'text-caption' : undefined" :style="{
            letterSpacing: isSmall ? '2px' : '4px',
            lineHeight: isSmall ? '20px' : '30px',
          }">
            EXPLORE DIVERSE NEIGHBORHOODS, EACH OFFERING UNIQUE AMENITIES AND
            LIFESTYLE OPPORTUNITIES.
          </p> -->
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <transition-group name="card-transition" mode="out-in">
        <v-col cols="12" md="4">
          <v-hover v-slot:default="{ isHovering, props }">
            <v-responsive class="rounded">
              <v-img
                :src="partner1"
                cover
                style="height: 100%"
                aspect-ratio="0.75"
              >
                <div
                  v-bind="props"
                  :style="[
                    isHovering
                      ? 'background-color: rgba(0, 0, 0, 0.0)'
                      : 'background-color: rgba(0, 0, 0, 0.3)',
                    'transition: background-color 0.3s ease',
                  ]"
                  class="fill-height py-8 text-white font-weight-light"
                >
                  <div
                    class="d-flex flex-column justify-space-between fill-height"
                  >
                    <div
                      class="font-weight-light text-center text-md-left px-6"
                    >
                      <!-- <div>{{ img.properties_count }} Properties</div> -->
                      <div class="font-weight-bold text-h5 text-white">
                        As a Delivery Rider
                      </div>
                    </div>
                    <div
                      class="d-flex flex-column justify-space-between align-center align-md-start ga-3 pl-6 pr-6 pr-md-14"
                    >
                      <div
                        class="d-flex flex-column ga-4 align-center align-md-start"
                      >
                        <div class="font-weight-bold">
                          <span class="text-yellow-lighten-1">Earn More</span
                          ><span class="text-white">
                            during your Free Time</span
                          >
                        </div>
                        <v-btn
                          :href="`https://api.whatsapp.com/send?phone=${footerData?.whats_app}&text=Hi I would like to apply as a Delivery Rider , partner`"
                          color="blue-lighten-1"
                          router-link
                          >Register Now</v-btn
                        >
                        <!-- <v-btn color="red-darken-2" :to="img.url" router-link>VIEW</v-btn> -->
                      </div>
                    </div>
                  </div>
                </div>
              </v-img>
            </v-responsive>
          </v-hover>
        </v-col>
        <v-col cols="12" md="4">
          <v-hover v-slot:default="{ isHovering, props }">
            <v-responsive class="rounded">
              <v-img
                :src="partner2"
                cover
                style="height: 100%"
                aspect-ratio="0.75"
              >
                <div
                  v-bind="props"
                  :style="[
                    isHovering
                      ? 'background-color: rgba(0, 0, 0, 0.0)'
                      : 'background-color: rgba(0, 0, 0, 0.3)',
                    'transition: background-color 0.3s ease',
                  ]"
                  class="fill-height py-8 text-white font-weight-light"
                >
                  <div
                    class="d-flex flex-column justify-space-between fill-height"
                  >
                    <div
                      class="font-weight-light text-center text-md-left px-6"
                    >
                      <!-- <div>{{ img.properties_count }} Properties</div> -->
                      <div class="font-weight-bold text-h5 text-white">
                        As a Shop / Mart Owner
                      </div>
                    </div>
                    <div
                      class="d-flex flex-column justify-space-between align-center align-md-start ga-3 pl-6 pr-6 pr-md-14"
                    >
                      <div
                        class="d-flex flex-column ga-4 align-center align-md-start"
                      >
                        <div
                          class="text-white font-weight-bold text-center text-md-left"
                        >
                          We will sell your Alcohol for you online.
                        </div>

                        <v-btn
                          :href="`https://api.whatsapp.com/send?phone=${footerData?.whats_app}&text=Hi I am a Shop Owner and would like to register on boozards. Pls send us some details`"
                          color="red-darken-1"
                          router-link
                          >Partner with Us</v-btn
                        >
                        <!-- <v-btn color="red-darken-2" :to="img.url" router-link>VIEW</v-btn> -->
                      </div>
                    </div>
                  </div>
                </div>
              </v-img>
            </v-responsive>
          </v-hover>
        </v-col>
        <v-col cols="12" md="4">
          <v-hover v-slot:default="{ isHovering, props }">
            <v-responsive class="rounded">
              <v-img
                :src="partner3"
                cover
                style="height: 100%"
                aspect-ratio="0.75"
              >
                <div
                  v-bind="props"
                  :style="[
                    isHovering
                      ? 'background-color: rgba(0, 0, 0, 0.0)'
                      : 'background-color: rgba(0, 0, 0, 0.3)',
                    'transition: background-color 0.3s ease',
                  ]"
                  class="fill-height py-8 text-white font-weight-light"
                >
                  <div
                    class="d-flex flex-column justify-space-between fill-height"
                  >
                    <div
                      class="font-weight-light text-center text-md-left px-6"
                    >
                      <!-- <div>{{ img.properties_count }} Properties</div> -->
                      <div class="font-weight-bold text-h5 text-white">
                        As a Pub / Club Owner
                      </div>
                    </div>
                    <div
                      class="d-flex flex-column justify-space-between align-center align-md-start ga-3 pl-6 pr-6 pr-md-14"
                    >
                      <div
                        class="d-flex flex-column ga-4 align-center align-md-start"
                      >
                        <div
                          class="text-white font-weight-bold text-center text-md-left"
                        >
                          List your Happy Hour / Promotions with us.
                        </div>

                        <v-btn
                          :href="`https://api.whatsapp.com/send?phone=${footerData?.whats_app}&text=Hi I am a Pub / Bar owner and would like to register on boozards. Pls send us some details`"
                          color="red-accent-1"
                          router-link
                          class="text-white"
                          >Get in Touch</v-btn
                        >
                        <!-- <v-btn color="red-darken-2" :to="img.url" router-link>VIEW</v-btn> -->
                      </div>
                    </div>
                  </div>
                </div>
              </v-img>
            </v-responsive>
          </v-hover>
        </v-col>
      </transition-group>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Partners",
  data() {
    return {
      screenWidth: window.innerWidth,
    };
  },
  computed: {
    ...mapState(["footerData"]),
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
  },
};
</script>

<script setup>
import partner1 from "@/assets/partner-1.jpg";
import partner2 from "@/assets/partner-2.jpg";
import partner3 from "@/assets/partner-3.jpg";
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap");

.cust-title-2 {
  font-family: "DM Serif Display", system-ui;
  font-weight: 400;
  font-size: 33px;
  line-height: 35px;
}

.cust-title-1 {
  font-family: "DM Serif Display", system-ui;
  font-weight: 400;
}

.img-cont {
  position: relative;
  overflow: hidden;
}

.img-item {
  transition: all 0.3s;
  width: 100%;
  height: auto;
  transform: scale(1);
}

.partners_box:hover .img-item {
  transform: scale(1.2);
}

.skeleton {
  width: 100%;
  height: 100%;
  border-radius: 0;

  background: linear-gradient(-90deg, #f2f2f2 0%, #e1e1e1 50%, #f2f2f2 100%);
  background-size: 400% 400%;
  animation: skeleton 1.6s ease infinite;
}

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
}

.page-opacity-enter-active,
.page-opacity-leave-active {
  transition: 400ms ease all;
}

.page-opacity-enter-from,
.page-opacity-leave-to {
  opacity: 0;
}
</style>
