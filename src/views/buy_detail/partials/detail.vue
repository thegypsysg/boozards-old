<template>
  <v-container class="pa-0 bg-white">
    <div class="height-detail">
      <v-img
        :src="$fileURL + main_image"
        cover
        style="height: 100%"
        aspect-ratio="1.1"
      >
        <v-hover v-slot:default="{ isHovering, props }">
          <div
            v-bind="props"
            :style="[
              isHovering
                ? 'background-color: rgba(0, 0, 0, 0.0)'
                : 'background-color: rgba(0, 0, 0, 0.5)',
              'transition: background-color 0.3s ease',
            ]"
            class="fill-height text-white font-weight-light"
          >
            <div
              class="d-flex flex-column justify-center align-start ga-9 ga-md-6 detail-cont"
            >
              <v-badge
                v-if="under_construction == 'Y'"
                content="UNDER CONSTRUCTION"
                inline
                color="blue-darken-4"
                rounded="0"
                class="text-body-1 font-weight-bold position-absolute ml-md-16 pl-md-16"
                style="top: 30px; left: 20px"
              ></v-badge>
              <div class="font-weight-light text-h3 mt-10 mt-md-0 text-white">
                {{ tag_line }}
              </div>
              <div class="text-body-2 text-white">
                Completion By :
                {{
                  completion_month && completion_year
                    ? `${completion_month} - ${completion_year}`
                    : completion_month && !completion_year
                      ? completion_month
                      : !completion_month && completion_year
                        ? completion_year
                        : "-"
                }}
              </div>

              <v-btn
                variant="outlined"
                class="text-white text-none text-body-2"
              >
                View Property
              </v-btn>
            </div>
          </div>
        </v-hover>
      </v-img>
    </div>
    <v-container class="pt-4 pb-8 w-100 w-md-50">
      <div class="text-h5 text-center">{{ construction_name }} Apartments</div>
      <p class="text-center text-body-2 mt-4">
        {{ brief_details }}
      </p>
    </v-container>
  </v-container>
</template>

<script setup>
const props = defineProps({
  under_construction: { type: String },
  main_image: { type: String },
  tag_line: { type: String },
  completion_month: { type: String },
  completion_year: { type: String },
  construction_name: { type: String },
  brief_details: { type: String },
});
</script>

<style scoped>
@media (min-width: 768px) {
  .detail-cont {
    padding: 100px 200px;
    max-width: 70%;
  }
}

@media (max-width: 768px) {
  .detail-cont {
    padding: 30px 20px;
  }
}

@media (min-width: 768px) {
  .height-detail {
    height: 80vh;
  }
}
</style>
