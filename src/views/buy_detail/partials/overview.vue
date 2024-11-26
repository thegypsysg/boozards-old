<template>
  <v-container class="pa-9 bg-white">
    <div class="d-flex justify-space-between">
      <div>Overview</div>
      <!-- <div><span class="font-weight-bold">PropertyId:</span> HZ40</div> -->
    </div>

    <hr class="my-6" />
    <v-row>
      <v-col cols="6" md="2">
        <div class="font-weight-bold">Apartment</div>
        <div class="font-weight-light">Property Type</div>
      </v-col>
      <v-col cols="6" md="2">
        <div class="font-weight-bold">
          <v-icon icon="mdi-bed-king-outline" size="20"></v-icon> 4
        </div>
        <div class="font-weight-light">Bedrooms</div>
      </v-col>
      <v-col cols="6" md="2">
        <div class="font-weight-bold">
          <v-icon icon="mdi-shower-head" size="20"></v-icon> 2
        </div>
        <div class="font-weight-light">Bathrooms</div>
      </v-col>
      <v-col cols="6" md="2">
        <div class="font-weight-bold">
          <v-icon icon="mdi-car-back" size="20"></v-icon> 1
        </div>
        <div class="font-weight-light">Garage</div>
      </v-col>
      <v-col cols="6" md="2">
        <div class="font-weight-bold">
          <v-icon icon="mdi-ruler-square" size="20"></v-icon> 2500
        </div>
        <div class="font-weight-light">Sq Ft</div>
      </v-col>
      <v-col cols="6" md="2">
        <div class="font-weight-bold">
          <v-icon icon="mdi-calendar" size="20"></v-icon> 2016
        </div>
        <div class="font-weight-light">Year Build</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts"></script>
