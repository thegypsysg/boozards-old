<template>
  <div class="my-10">
    <div
      class="d-none my-6 d-md-flex ga-6 overflow-x-auto flex-row scroll-menu scroll-cont mx-14"
    >
      <v-btn
        v-for="(menu, index) in editionItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), false)"
        variant="outlined"
        class="text-caption font-weight-bold"
        rounded
        >{{ menu.label }}</v-btn
      >
    </div>
    <v-container
      class="d-flex d-md-none ga-6 overflow-x-auto flex-row scroll-menu scroll-cont"
    >
      <v-btn
        v-for="(menu, index) in editionItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), true)"
        variant="outlined"
        class="text-caption font-weight-bold"
        rounded
        >{{ menu.label }}</v-btn
      >
    </v-container>

    <div
      class="d-none my-6 d-md-flex ga-6 overflow-x-auto flex-row scroll-menu scroll-cont mx-14"
    >
      <v-btn
        v-for="(menu, index) in priceItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), false)"
        variant="outlined"
        class="text-caption font-weight-bold"
        rounded
        >{{ menu.label }}</v-btn
      >
    </div>
    <v-container
      class="d-flex d-md-none ga-6 overflow-x-auto flex-row scroll-menu scroll-cont"
    >
      <v-btn
        v-for="(menu, index) in priceItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), true)"
        variant="outlined"
        class="text-caption font-weight-bold"
        rounded
        >{{ menu.label }}</v-btn
      >
    </v-container>

    <div
      class="d-none my-6 d-md-flex ga-6 overflow-x-auto flex-row scroll-menu scroll-cont mx-14"
    >
      <v-btn
        v-for="(menu, index) in promoItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), false)"
        variant="outlined"
        class="text-caption font-weight-bold"
        rounded
        >{{ menu.label }}</v-btn
      >
    </div>
    <v-container
      class="d-flex d-md-none ga-6 overflow-x-auto flex-row scroll-menu scroll-cont"
    >
      <v-btn
        v-for="(menu, index) in promoItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), true)"
        variant="outlined"
        class="text-caption font-weight-bold"
        rounded
        >{{ menu.label }}</v-btn
      >
    </v-container>

    <div
      class="d-none my-6 d-md-flex ga-6 overflow-x-auto flex-row scroll-menu scroll-cont mx-14"
    >
      <v-btn
        v-for="(menu, index) in placeItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), false)"
        variant="outlined"
        class="text-caption font-weight-bold"
        style="min-width: 100px !important"
        rounded
        >{{ menu.label }}</v-btn
      >
    </div>
    <v-container
      class="d-flex d-md-none ga-6 overflow-x-auto flex-row scroll-menu scroll-cont"
    >
      <v-btn
        v-for="(menu, index) in placeItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), true)"
        variant="outlined"
        class="text-caption font-weight-bold"
        style="min-width: 100px !important"
        rounded
        >{{ menu.label }}</v-btn
      >
    </v-container>
  </div>
</template>

<script setup>
import { ref } from "vue";

const editionItems = ref([
  {
    label: "Gift Items",
  },
  {
    label: "Limited Edition",
  },
  {
    label: "Special Edition",
  },
  {
    label: "Miniatures",
  },
]);

const priceItems = ref([
  {
    label: "Upto S$ 500",
  },
  {
    label: "S$ 500 to S$ 1000",
  },
  {
    label: "S$ 1000 to S$ 2000",
  },
  {
    label: "S$ 2000 to S$ 3000",
  },
  {
    label: "S$ 3000 to S$ 5000",
  },
  {
    label: "S$ 5000 to S$ 10000",
  },
  {
    label: "Above S$ 10000",
  },
]);

const promoItems = ref([
  {
    label: "Happy Hour",
  },
  {
    label: "Promotions",
  },
]);

const placeItems = ref([
  {
    label: "Bars",
  },
  {
    label: "Clubs",
  },
]);

const formatName = (name) => name.toLowerCase().replace(/\s+/g, "");

function scrollToSection(sectionId, mobile) {
  const cardSection = document.getElementById(sectionId);

  // this.$nextTick(() => {
  if (cardSection) {
    const cardRect = cardSection.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offset = mobile
      ? cardRect.top + scrollTop - 300
      : cardRect.top + scrollTop - 100; // Nilai offset yang diinginkan, dalam piksel

    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  }
  // });
  // window.scrollBy(0, -scrollOffset);
}
</script>

<style scoped>
.scroll-cont::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scroll-cont {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
