<template>
  <v-row class="d-none d-md-flex justify-center mt-10">
    <v-col cols="3">
      <v-img
        src="https://demo03.houzez.co/wp-content/uploads/2016/03/040.jpg"
        cover
        style="height: 100%"
        aspect-ratio="1.1"
      >
      </v-img>
    </v-col>
    <v-col cols="5">
      <v-card
        flat
        class="d-flex flex-column justify-space-between fill-height bg-transparent"
      >
        <div
          class="d-flex flex-column justify-center align-md-center fill-height"
        >
          <div>
            <v-card-title class="text-h5 font-weight-bold px-0"
              >About Us</v-card-title
            >
            <v-card-text class="font-weight-light px-0">
              {{ desc }}
            </v-card-text>
            <v-card-actions>
              <v-btn variant="tonal" color="red">About Us</v-btn>
            </v-card-actions>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-container class="pa-9 bg-white d-block d-md-none mt-6">
    <div>About Us</div>
    <hr class="my-6" />
    <p class="font-weight-light text-caption mt-6">
      {{ desc }}
    </p>
    <p class="mt-6 text-body-2 text-blue-darken-3 font-weight-bold">More</p>
  </v-container>
</template>

<script setup lang="ts">
const props = defineProps<{
  desc: string;
}>();

// const showOption = ref(false);
// watchEffect(() => {
//   showOption.value = props.show_option;
// })
</script>
