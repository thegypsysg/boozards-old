<script setup>
import { onMounted, ref, nextTick } from "vue";
import axios from "@/util/axios";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import { appId, fileURL } from "../main";

defineProps({
  desktop: Boolean,
});

const splideOptions = {
  perPage: 9,
  arrows: true,
  pagination: false,
  gap: "2rem",
  breakpoints: {
    640: {
      perPage: 4,
    },
    960: {
      perPage: 7,
    },
    1200: {
      perPage: 10,
    },
  },
};

const splideRef = ref(null);
const isBeginning = ref(true);
const isEnd = ref(false);

const menuLists = ref([]);

const formatName = (name) => name.toLowerCase().replace(/\s+/g, "");

// const scrollToSection = (sectionId) => {
//   console.log(sectionId);
//   const element = document.getElementById(sectionId);
//   if (element) {
//     element.scrollIntoView({ behavior: "smooth" });
//   }
// };

function scrollToSection(sectionId, mobile) {
  const cardSection = document.getElementById(sectionId);

  // this.$nextTick(() => {
  if (cardSection) {
    const cardRect = cardSection.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offset = mobile
      ? cardRect.top + scrollTop - 300
      : cardRect.top + scrollTop - 50; // Nilai offset yang diinginkan, dalam piksel

    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  }
  // });
  // window.scrollBy(0, -scrollOffset);
}

const goNext = () => {
  splideRef.value?.splide?.go("+1");
};

const goPrev = () => {
  splideRef.value?.splide?.go("-1");
};

const handleSlideMove = () => {
  const splide = splideRef.value?.splide;
  if (splide) {
    isBeginning.value = splide.index === 0;
    isEnd.value = splide.index >= splide.length - splide.options.perPage;
  }
};

const getMenuListData = () => {
  axios
    .get(`/categories/active-website/app/${appId}`)
    .then((response) => {
      const data = response.data.data;
      menuLists.value = data
        .sort(function (a, b) {
          return a.category_id - b.category_id;
        })
        .filter((item) => item.active == "Y");
      console.log(menuLists.value);
      // let itemFinal = [];
    })
    .catch((error) => {
      // eslint-disable-next-line

      throw error;
    });
};

onMounted(() => {
  nextTick(() => {
    const splide = splideRef.value?.splide;
    if (splide) {
      splide.on("moved mounted", handleSlideMove);
      handleSlideMove();
    }
  });
  getMenuListData();
});
</script>

<template>
  <div
    v-if="!desktop"
    class="d-flex ga-6 overflow-x-auto flex-row scroll-menu scroll-cont"
  >
    <div
      v-for="menu in menuLists"
      :key="menu.category_id"
      class="d-flex align-center ga-4 flex-column"
      @click="scrollToSection(formatName(menu.category_name), true)"
    >
      <a class="d-flex flex-column align-center border-black pa-2 rounded-lg">
        <v-avatar :size="70">
          <v-img aspect-ratio="1" cover :src="fileURL + menu.image"></v-img>
        </v-avatar>
        <p class="text-no-wrap d-flex align-center mt-2 text-caption">
          {{ menu.category_name }}
        </p>
      </a>
    </div>
  </div>

  <div v-if="desktop" class="explore-section d-none d-md-block">
    <!-- <v-container> -->
    <div class="position-relative pt-14">
      <!-- <v-btn
        v-if="!isBeginning"
        icon
        class="custom-arrow prev-arrow"
        @click="goPrev"
      >
        <span class="arrow-icon">←</span>
      </v-btn> -->

      <Splide class="px-16" ref="splideRef" :options="splideOptions">
        <SplideSlide v-for="menu in menuLists" :key="menu.category_id">
          <v-card
            @click="scrollToSection(formatName(menu.category_name), false)"
            class="card-wrapper"
            elevation="3"
          >
            <v-avatar :size="80">
              <v-img aspect-ratio="1" cover :src="fileURL + menu.image"></v-img>
            </v-avatar>
            <div class="card-title">
              <!-- <span class="text-center">{{ menu.category_name }}</span> -->
              <span class="text-center text-body-2 text-no-wrap">{{
                menu.category_name
              }}</span>
            </div>
            <div
              class="text-no-wrap d-flex align-center font-weight-bold text-caption mt-n2"
            >
              <span class="text-red-darken-1">
                <!-- {{ menu?.properties_count }} -->
                12
              </span>
              &nbsp;
              <span> Products</span>
            </div>
          </v-card>
        </SplideSlide>
      </Splide>

      <!-- <v-btn v-if="!isEnd" icon class="custom-arrow next-arrow" @click="goNext">
        <span class="arrow-icon">→</span>
      </v-btn> -->
    </div>
    <!-- </v-container> -->
  </div>
</template>

<!-- .explore-section {
  padding: 2rem;
} -->
<style scoped>
.card-wrapper {
  margin: 0.5rem;
  overflow: hidden;
  background: transparent;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: none !important;
}

.card-wrapper:hover {
  transform: translateY(-4px);
}

.card-title {
  padding: 1rem;
  text-align: center;
  font-weight: 500;
}

.custom-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: white !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.prev-arrow {
  left: -20px;
}

.next-arrow {
  right: -20px;
}

.arrow-icon {
  font-size: 24px;
  line-height: 1;
}

.scroll-cont::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scroll-cont {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
