<template>
  <div class="my-4 py-4 bg-grey-lighten-4">
    <div
      class="d-none my-6 d-md-flex ga-3 overflow-x-auto flex-row scroll-menu scroll-cont mx-14"
    >
      <v-btn
        v-for="(menu, index) in editionItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), false)"
        variant="outlined"
        class="text-caption font-weight-bold"
        rounded
        size="small"
        >{{ menu.label }}</v-btn
      >
    </div>
    <v-container
      class="d-flex d-md-none ga-3 overflow-x-auto flex-row scroll-menu scroll-cont"
    >
      <v-btn
        v-for="(menu, index) in editionItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), true)"
        variant="outlined"
        class="text-caption font-weight-bold"
        rounded
        size="small"
        >{{ menu.label }}</v-btn
      >
    </v-container>

    <div
      class="d-none my-6 d-md-flex ga-3 overflow-x-auto flex-row scroll-menu scroll-cont mx-14"
    >
      <v-btn
        v-for="(menu, index) in props.priceItems"
        :key="index"
        @click="scrollToSection(formatName(menu.display_price_range), false)"
        variant="outlined"
        class="text-caption font-weight-bold"
        size="small"
        rounded
        >{{ menu.display_price_range }}</v-btn
      >
    </div>
    <v-container
      class="d-flex d-md-none ga-3 overflow-x-auto flex-row scroll-menu scroll-cont"
    >
      <v-btn
        v-for="(menu, index) in props.priceItems"
        :key="index"
        @click="scrollToSection(formatName(menu.display_price_range), true)"
        variant="outlined"
        class="text-caption font-weight-bold"
        size="small"
        rounded
        >{{ menu.display_price_range }}</v-btn
      >
    </v-container>

    <div
      class="d-none my-6 d-md-flex ga-3 overflow-x-auto flex-row scroll-menu scroll-cont mx-14"
    >
      <v-btn
        v-for="(menu, index) in promoItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), false)"
        variant="outlined"
        class="text-caption font-weight-bold"
        rounded
        size="small"
        >{{ menu.label }}</v-btn
      >
    </div>
    <v-container
      class="d-flex d-md-none ga-3 overflow-x-auto flex-row scroll-menu scroll-cont"
    >
      <v-btn
        v-for="(menu, index) in promoItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), true)"
        variant="outlined"
        class="text-caption font-weight-bold"
        rounded
        size="small"
        >{{ menu.label }}</v-btn
      >
    </v-container>

    <div
      class="d-none my-6 d-md-flex ga-3 overflow-x-auto flex-row scroll-menu scroll-cont mx-14"
    >
      <v-btn
        v-for="(menu, index) in placeItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), false)"
        variant="outlined"
        class="text-caption font-weight-bold"
        style="min-width: 100px !important"
        rounded
        size="small"
        >{{ menu.label }}</v-btn
      >
    </div>
    <v-container
      class="d-flex d-md-none ga-3 overflow-x-auto flex-row scroll-menu scroll-cont"
    >
      <v-btn
        v-for="(menu, index) in placeItems"
        :key="index"
        @click="scrollToSection(formatName(menu.label), true)"
        variant="outlined"
        class="text-caption font-weight-bold"
        style="min-width: 100px !important"
        rounded
        size="small"
        >{{ menu.label }}</v-btn
      >
    </v-container>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  priceItems: Array,
});

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
