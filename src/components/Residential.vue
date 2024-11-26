<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-row>
        <v-col>
          <v-responsive :aspect-ratio="$vuetify.display.mdAndUp ? 1 : undefined">
            <v-card flat class="d-flex flex-column justify-space-between fill-height">
              <div class="d-flex flex-column justify-center align-md-center fill-height">
                <div>
                  <v-card-title class="text-h5 font-weight-light px-0">Residential</v-card-title>
                  <v-card-text class="font-weight-light px-0">
                    We have the best residential properties to suit your lifestyle
                  </v-card-text>
                </div>
              </div>
              <v-divider width="30%" opacity="1" class="mt-14 mt-md-0"></v-divider>
            </v-card>
          </v-responsive>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <GridCard :image="`${$fileURL + data[0]?.image}`" :properties_name="data[0]?.property_name"
            properties_count="23" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="4" class="d-flex flex-column">
      <GridCard :image="$fileURL + data[1]?.long_image" :properties_name="data[1]?.property_name"
        properties_count="7" />
    </v-col>

    <v-col cols="12" md="4">
      <v-row>
        <v-col>
          <GridCard :image="$fileURL + data[2]?.image" :properties_name="data[2]?.property_name"
            properties_count="12" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <GridCard :image="$fileURL + data[3]?.image" :properties_name="data[3]?.property_name"
            properties_count="12" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script setup>
import GridCard from "./GridCard.vue";


import { onMounted } from "vue";
import { eventBus } from "@/util/bus";
import AOS from "aos";
const props = defineProps({
  data: {
    type: Array,
  },
});
function scrollToSection() {
  eventBus.scrollToSection = "happeningTarget"; // Ganti dengan ID section yang diinginkan
}

onMounted(() => {
  AOS.init();
});
</script>
