<template>
  <v-container id="happeningTarget">
    <div>
      <p class="text-center text-caption">
        <span class="mdi mdi-domain"></span> FEATURED HOMES
      </p>
      <p align="center" class="header-title cust-title mt-4">
        Our New Homes For Sale and Rent
      </p>
      <p
        class="text-center text-grey-darken-1 mt-n4 mx-16 text-caption"
        style="letter-spacing: 2px; line-height: 20px"
      >
        OUR PORTFOLIO INCLUDES HIGH-QUALITY VILLAS, SPACIOUS APARTMENTS, AND
        THOUGHTFULLY DESIGNED TOWNHOUSES.
      </p>
    </div>
    <div
      class="happening d-flex justify-center flex-column align-center mb-md-8 mb-sm-2"
    >
      <div
        class="happening d-flex flex-column justify-center align-center mb-8 mt-16"
      >
        <v-lazy 
          v-for="(image, index) in images" 
          :key="index"
          :options="{ threshold: 0.5 }" 
          min-height="270"
        >
          <v-card class="happening-item" elevation="0">
            <div class="happening-info text-white">
              <h3 class="font-weight-black">{{ image.alt }}</h3>
              <p class="font-weight-bold text-body-2">24 Properties</p>
            </div>

            <div class="overlay"></div>
            <v-img
              min-width="270"
              min-height="370"
              class="happening-item-img"
              :src="image.src"
              :alt="image.alt"
              transition="fade-transition"
            >
              <template #placeholder>
                <div class="skeleton" />
              </template>
            </v-img>
          </v-card>
        </v-lazy>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { eventBus } from "@/util/bus";
import { onMounted, watch, nextTick } from "vue";


const images = [
  {
    src: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    alt: 'Kingfisher Beer'
  },
  {
    src: whisky,
    alt: 'Japanese Whisky'
  },
  {
    src: whisky3,
    alt: 'Makers Mark'
  },
  {
    src: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=2067&auto=format&fit=crop',
    alt: 'Champagne'
  },
  {
    src: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1887&auto=format&fit=crop',
    alt: 'Vodka Bottles'
  },
  {
    src: drink,
    alt: 'Guinness'
  }
]

onMounted(() => {
  watch(
    () => eventBus.scrollToSection,
    async (newValue) => {
      if (newValue) {
        await nextTick();
        const element = document.getElementById(newValue);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          eventBus.scrollToSection = null;
        }
      }
    },
  );
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap");

.cust-title {
  font-family: "DM Serif Display", system-ui;
  font-weight: 400;
  font-size: 33px;
  line-height: 35px;
}

.happening {
  gap: 20px;
}
.happening-title {
  max-width: 300px;
}

@media screen and (max-width: 1170px) {
  .happening-title {
    max-width: 200px;
  }
}

.happening-title h1 {
  font-weight: 500;
}
.happening-title p {
  color: #5f5f5f;
}

.line-divider {
  height: 6px;
  width: 240px;
  background: #f9bc06;
  border-radius: 100%;
}

.happening-item {
  position: relative;
  overflow: hidden;
}
.happening-item-img {
  max-width: 100%;
  transition: all 0.3s;
  display: block;
  width: 100%;
  height: auto;
  transform: scale(1);
}

.happening-item:hover .happening-item-img {
  transform: scale(1.1);
}

.happening-info {
  position: absolute;
  top: 20px;
  color: white;
  z-index: 100;
  font-size: 30px;
  font-weight: 600;
  text-align: center;
  width: 100%;
}

.happening-item:hover .happening-info {
  font-weight: 700;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* Warna overlay dan transparansi */
  z-index: 1;
}

.happening-link {
  background: rgba(0, 0, 0, 0.429);
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
  height: 70px;
  width: 100%;
  position: absolute;
  bottom: -100px;
}

.skeleton {
  width: 100%;
  height: 100%;
  border-radius: 20px;
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
</style>
