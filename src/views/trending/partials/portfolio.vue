<template>
  <div>
    <div class="d-flex gap-2 justify-center ga-3 mt-12">
      <span class="mdi mdi-office-building-outline"></span>
      <span>EXCLUSIVE PORTFOLIO</span>
    </div>
    <div class="featured-title text-h4 text-md-h3 text-center mt-6">
      EXPLORE OUR RANGE OF PREMIUM PROPERTIES
    </div>

    <div class="featured-sub-title text-center text-grey-darken-1 mt-6">
      OUR PORTFOLIO INCLIDES HIGH-QUALITY VILLAS, SPACIOUS APARTMENTS, AND THOUGHTFUL DESIGNED TOWNHOUSES
    </div>

    <div class="d-flex flex-column flex-md-row ga-10 justify-center mt-10">
      <template v-for="(p, i) in portfolios" :key="i">
        <v-btn class="font-weight-bold">{{ p.name }} (<span class="text-red">{{ p.count }}</span>)</v-btn>
      </template>
    </div>

    <div class="w-100 d-flex justify-center mt-6">
      <v-btn class="bg-black">
        View More
        <v-icon right class="ml-4">mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
const portfolios = [
  {
    name: 'Studio',
    count: 3
  },
  {
    name: 'Condo',
    count: 2
  },
  {
    name: 'Villa',
    count: 3
  },
  {
    name: 'Penthouse',
    count: 2
  },
]
</script>

<style scoped></style>
