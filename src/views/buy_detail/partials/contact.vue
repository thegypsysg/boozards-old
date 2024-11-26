<template>
  <v-container class="pa-9 bg-white">
    <div>Contact Information</div>

    <hr class="my-6" />

    <div class="d-flex ga-2 align-center">
      <v-avatar
        color="grey"
        size="150"
        style="border-radius: 5px"
        class="d-none d-md-block"
      >
        <v-img :src="$fileURL + agent_main_image" cover></v-img>
      </v-avatar>
      <!-- <v-avatar
        color="grey"
        size="80"
        style="border-radius: 5px"
        class="d-block d-md-none"
      >
        <v-img :src="$fileURL + agent_main_image" cover></v-img>
      </v-avatar> -->
      <div class="d-none d-md-block">
        <div class="text-h6 font-weight-normal">
          <v-icon icon="mdi-account-outline" size="20"></v-icon>
          {{ agent_name }}
        </div>
        <div class="d-flex ga-3 mt-2">
          <div class="font-weight-light text-body-2">
            <a
              style="text-decoration: none; color: black"
              :href="`mailto:${email}`"
            >
              <v-icon icon="mdi-gmail" size="18"></v-icon> {{ email }}
            </a>
          </div>
          <div class="font-weight-light text-body-2">
            <a
              style="text-decoration: none; color: black"
              :href="`tel://${mobile}`"
            >
              <v-icon icon="mdi-cellphone-basic" size="18"></v-icon>
              {{ mobile }}
            </a>
          </div>
          <div class="font-weight-light text-body-2">
            <a
              style="text-decoration: none; color: black"
              :href="`https://api.whatsapp.com/send?phone=${whats_app}&text=Hi there , I am interested in ${project} by ${partner}`"
            >
              <v-icon icon="mdi-whatsapp" size="18"></v-icon> {{ whats_app }}
            </a>
          </div>
        </div>
      </div>
      <!-- <div class="w-100 d-block d-md-none">
        <div class="d-flex justify-space-between align-center">
          <div class="text-h6 font-weight-light">
            {{ agent_name }}
          </div>
          <div class="d-flex align-center ga-2">
            <div
              class="pa-4 rounded-sm"
              style="background-color: #29a743 !important"
            >
              <a
                :href="`https://api.whatsapp.com/send?phone=${whats_app}&text=Hi there , I am interested in ${project} by ${partner}`"
              >
                <v-icon
                  class="text-white"
                  icon="mdi-message-outline"
                  size="20"
                ></v-icon>
              </a>
            </div>
            <div
              class="pa-4 border-thin rounded-sm"
              style="border-color: #29a743 !important"
            >
              <a :href="`tel://${mobile}`">
                <v-icon
                  style="color: #29a743 !important"
                  icon="mdi-phone-outline"
                  size="20"
                ></v-icon>
              </a>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </v-container>
</template>

<script setup>
const props = defineProps({
  agent_main_image: { type: String },
  agent_name: { type: String },
  email: { type: String },
  mobile: { type: String },
  whats_app: { type: String },
  project: { type: String },
  partner: { type: String },
});
</script>
