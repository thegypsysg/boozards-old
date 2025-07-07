<template>
  <div id="happyhour" class="mb-14 mt-md-10 mt-6">
    <v-row>
      <v-col cols="12">
        <div>
          <p class="font-weight-black text-h5">
            <span class="text-blue-accent-4">Happy Hour </span>
            <span> Around You</span>
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-8">
      <transition-group name="card-transition" mode="out-in">
        <v-col cols="12" md="3">
          <v-responsive class="rounded">
            <v-img :src="happy1" cover style="height: 100%" aspect-ratio="0.75">
            </v-img>
          </v-responsive>
          <div class="d-flex align-center justify-start ga-7 mt-8">
            <v-avatar :size="70">
              <v-img aspect-ratio="1" cover :src="happyLogo"></v-img>
            </v-avatar>
            <div class="text-body-1">
              <p class="font-weight-bold text-purple-accent-4">Emo's Bar</p>
              <p class="text-grey font-weight-medium">406 East Coast Road</p>
              <p class="font-weight-medium">
                <span class="text-orange">3.0 kms </span
                ><span class="text-grey-darken-2"> away</span>
              </p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <v-responsive class="rounded">
            <v-img :src="happy2" cover style="height: 100%" aspect-ratio="0.75">
            </v-img>
          </v-responsive>
          <div class="d-flex align-center justify-start ga-7 mt-8">
            <v-avatar :size="70">
              <v-img aspect-ratio="1" cover :src="happyLogo"></v-img>
            </v-avatar>
            <div class="text-body-1">
              <p class="font-weight-bold text-purple-accent-4">Emo's Bar</p>
              <p class="text-grey font-weight-medium">406 East Coast Road</p>
              <p class="font-weight-medium">
                <span class="text-orange">3.0 kms </span
                ><span class="text-grey-darken-2"> away</span>
              </p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <v-responsive class="rounded">
            <v-img :src="happy3" cover style="height: 100%" aspect-ratio="0.75">
            </v-img>
          </v-responsive>
          <div class="d-flex align-center justify-start ga-7 mt-8">
            <v-avatar :size="70">
              <v-img aspect-ratio="1" cover :src="happyLogo"></v-img>
            </v-avatar>
            <div class="text-body-1">
              <p class="font-weight-bold text-purple-accent-4">Emo's Bar</p>
              <p class="text-grey font-weight-medium">406 East Coast Road</p>
              <p class="font-weight-medium">
                <span class="text-orange">3.0 kms </span
                ><span class="text-grey-darken-2"> away</span>
              </p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <v-responsive class="rounded">
            <v-img :src="happy4" cover style="height: 100%" aspect-ratio="0.75">
            </v-img>
          </v-responsive>
          <div class="d-flex align-center justify-start ga-7 mt-8">
            <v-avatar :size="70">
              <v-img aspect-ratio="1" cover :src="happyLogo"></v-img>
            </v-avatar>
            <div class="text-body-1">
              <p class="font-weight-bold text-purple-accent-4">Emo's Bar</p>
              <p class="text-grey font-weight-medium">406 East Coast Road</p>
              <p class="font-weight-medium">
                <span class="text-orange">3.0 kms </span
                ><span class="text-grey-darken-2"> away</span>
              </p>
            </div>
          </div>
        </v-col>
      </transition-group>
    </v-row>
  </div>
</template>

<script setup>
import happy1 from "@/assets/happy-1.jpg";
import happy2 from "@/assets/happy-2.jpg";
import happy3 from "@/assets/happy-3.jpg";
import happy4 from "@/assets/happy-4.jpg";
import happyLogo from "@/assets/happy-logo.jpg";
</script>
