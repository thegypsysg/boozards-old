<template>
  <v-hover v-slot:default="{ isHovering, props }">
    <v-responsive
      v-if="isSquare"
      aspect-ratio="1"
      :style="`height: 100%; width: 100%; background-image:url('${image}'); background-size: cover;`"
      class="trending rounded"
    >
      <div
        v-bind="props"
        :style="[
          isHovering
            ? 'background-color: rgba(0, 0, 0, 0.0)'
            : 'background-color: rgba(0, 0, 0, 0.3)',
          'transition: background-color 0.3s ease',
        ]"
        class="fill-height d-flex flex-column-reverse flex-md-column align-md-center justify-between pa-2 pa-md-8 text-white font-weight-light"
      >
        <div v-if="show_text ?? false" class="text-md-center font-weight-bold">
          <div class="text-h6 text-md-h4 font-weight-bold text-white">
            {{ title }}
          </div>
          <!-- <div class="text-body-2 font-weight-bold">24 Properties</div> -->
        </div>
        <div
          v-if="show_option ?? false"
          class="text-center mt-auto mb-auto"
          :style="[
            isHovering
              ? 'transform: translateY(30px); opacity:1'
              : 'transform: translateY(0); opacity:0',
            'transition: 0.7s ease-out',
          ]"
        >
          <v-btn
            class="ma-2 text-caption"
            :size="$vuetify.display.mdAndUp ? 'large' : 'x-small'"
            @click="showDialog"
            color="pink darken-1"
            rounded
          >
            View Options
          </v-btn>
          <!-- <v-btn
            :to="`/${title.replaceAll(' ', '-').toLocaleLowerCase()}`"
            class="ma-2 text-caption"
            :size="$vuetify.display.mdAndUp ? 'large' : 'x-small'"
            color="pink darken-1"
            rounded
          >
            View Options
          </v-btn> -->
        </div>
      </div>
    </v-responsive>
    <v-responsive
      v-else
      :style="`height: 100%; width: 100%; background-image:url('${image}'); background-size: cover; background-position: center;`"
      class="trending rounded"
    >
      <div
        v-if="show_title == true"
        v-bind="props"
        :style="[
          isHovering
            ? 'background-color: rgba(0, 0, 0, 0.0)'
            : 'background-color: rgba(0, 0, 0, 0.3)',
          'transition: background-color 0.3s ease',
        ]"
        class="text-h6 fill-height w-100 text-md-h4 font-weight-bold text-white"
      >
        <!-- <div v-if="show_title ?? false" class="text-left font-weight-bold"> -->
        <div
          class="text-h6 text-md-h4 w-33 font-weight-bold text-white position-absolute"
          style="left: 50px; bottom: 20px"
        >
          {{ title }}
        </div>
        <!-- </div> -->
      </div>
      <div
        v-else
        v-bind="props"
        :style="[
          isHovering
            ? 'background-color: rgba(0, 0, 0, 0.0)'
            : 'background-color: rgba(0, 0, 0, 0.3)',
          'transition: background-color 0.3s ease',
        ]"
        class="fill-height d-flex flex-column align-center justify-between pa-2 pa-md-8 text-white font-weight-light"
      >
        <div v-if="show_text ?? false" class="text-center font-weight-bold">
          <div class="text-h6 text-md-h4 font-weight-bold text-white">
            {{ title }}
          </div>
          <!-- <div class="text-body-2 font-weight-bold">24 Properties</div> -->
        </div>

        <div
          v-if="show_option ?? false"
          class="text-center mt-auto mb-auto"
          :style="[
            isHovering
              ? 'transform: translateY(30px); opacity:1'
              : 'transform: translateY(0); opacity:0',
            'transition: 0.7s ease-out',
          ]"
        >
          <v-btn
            class="ma-2 text-caption"
            :size="$vuetify.display.mdAndUp ? 'large' : 'x-small'"
            @click="showDialog"
            color="pink darken-1"
            rounded
          >
            View Options
          </v-btn>
          <!-- <v-btn
            :to="`/${title.replaceAll(' ', '-').toLocaleLowerCase()}`"
            class="ma-2 text-caption"
            :size="$vuetify.display.mdAndUp ? 'large' : 'x-small'"
            color="pink darken-1"
            rounded
          >
            View Options
          </v-btn> -->
        </div>
      </div>
    </v-responsive>
  </v-hover>
</template>

<script setup>
import { useStore } from "vuex";

const props = defineProps({
  title: String,
  image: String,
  isSquare: Boolean,
  show_text: Boolean,
  show_option: Boolean,
  show_title: Boolean,
});

const store = useStore();

// const showOption = ref(false);
// watchEffect(() => {
//   showOption.value = props.show_option;
// })

const showDialog = () => {
  store.commit("setIsCountryUpdating", true);
};
</script>
