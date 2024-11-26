<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-responsive :aspect-ratio="$vuetify.display.mdAndUp ? 1 : undefined">
        <v-card flat class="d-flex flex-column justify-space-between fill-height">
          <div class="d-flex flex-column justify-center align-md-center fill-height">
            <div>
              <v-card-title class="text-h5 font-weight-light px-0">Commercial</v-card-title>
              <v-card-text class="font-weight-light px-0">
                Office or Warehouse to suit your business needs
              </v-card-text>
            </div>
          </div>
          <v-divider width="30%" opacity="1" class="mt-14 mt-md-0"></v-divider>
        </v-card>
      </v-responsive>
    </v-col>
    <template v-if="!isSmall">
      <v-col cols="12" md="4">
        <GridCard :image="`${$fileURL + data[0]?.image}`" :properties_name="data[0]?.property_name"
          properties_count="3" />
      </v-col>
      <v-col cols="12" md="4">
        <GridCard :image="`${$fileURL + data[1]?.image}`" :properties_name="data[1]?.property_name"
          properties_count="3" />
      </v-col>
    </template>
  </v-row>
</template>
<script setup>
import GridCard from "./GridCard.vue";

const props = defineProps({
  isSmall: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
  },
});

</script>
