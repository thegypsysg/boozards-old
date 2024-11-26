<template>
  <v-container class="pa-9 bg-white">
    <div>Video</div>

    <hr class="my-6" />

    <v-responsive aspect-ratio="1.7">
      <iframe
        width="100%"
        height="100%"
        :src="formattedVideoLink"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  video_link: { type: String },
});

const formattedVideoLink = computed(() => {
  // Regex untuk menangkap ID video baik dari youtu.be atau youtube.com/watch?v=
  const videoIdMatch = props.video_link?.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\/))([a-zA-Z0-9_-]{11})/,
  );
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  // Gabungkan dengan base URL untuk embed jika videoId ditemukan
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
});
</script>
