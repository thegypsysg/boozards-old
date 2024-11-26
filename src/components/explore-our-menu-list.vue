<script setup>
import { onMounted, ref, nextTick } from 'vue';
import axios from '@/util/axios';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

defineProps({
  desktop: Boolean
})

const splideOptions = {
  perPage: 6,
  arrows: false,
  pagination: false,
  gap: '2rem',
  breakpoints: {
    640: {
      perPage: 2,
    },
    960: {
      perPage: 4,
    },
    1200: {
      perPage: 6,
    },
  }
}

const splideRef = ref(null);
const isBeginning = ref(true);
const isEnd = ref(false);

const goNext = () => {
  splideRef.value?.splide?.go('+1');
};

const goPrev = () => {
  splideRef.value?.splide?.go('-1');
};

const handleSlideMove = () => {
  const splide = splideRef.value?.splide;
  if (splide) {
    isBeginning.value = splide.index === 0;
    isEnd.value = splide.index >= splide.length - splide.options.perPage;
  }
};

onMounted(() => {
  nextTick(() => {
    const splide = splideRef.value?.splide;
    if (splide) {
      splide.on('moved mounted', handleSlideMove);
      handleSlideMove();
    }
  });
});

const menuLists = ref([
  {
    img: 'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?q=80&w=2070&auto=format&fit=crop',
    title: 'Beer',
    id: 'Beer'
  },
  {
    img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
    title: 'Wine',
    id: 'Wine'
  },
  {
    img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop',
    title: 'Vodka',
    id: 'Vodka'
  },
  {
    img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=2070&auto=format&fit=crop',
    title: 'Whisky',
    id: 'Whisky'
  },
  {
    img: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?q=80&w=2070&auto=format&fit=crop',
    title: 'Soda',
    id: 'Soda'
  },
  {
    img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop',
    title: 'Gin',
    id: 'Gin'
  },
  {
    img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop',
    title: 'Tequila',
    id: 'Tequila'
  },
  {
    img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop',
    title: 'Irish Cream',
    id: 'Irish Cream'
  }
  ]);
</script>

<template>
  <div v-if="!desktop" class="d-flex ga-6 overflow-x-auto flex-row scroll-menu">
    <div v-for="(menu, i) in menuLists" :key="i" class="d-flex align-center ga-4 flex-column">
      <a @click="console.log(menu.id)" class="d-flex border-black pa-2 rounded-lg">
        <v-avatar :size="40">
          <v-img aspect-ratio="1" cover :src="menu.img"></v-img>
        </v-avatar>
        <p class="text-no-wrap d-flex align-center pl-2 text-caption">{{ menu.title }}</p>
      </a>
    </div>
  </div>
  
  <div v-if="desktop" class="explore-section">
    <v-container>
      <div class="position-relative">
        <v-btn
          v-if="!isBeginning"
          icon
          class="custom-arrow prev-arrow"
          @click="goPrev"
        >
          <span class="arrow-icon">←</span>
        </v-btn>

        <Splide ref="splideRef" :options="splideOptions">
          <SplideSlide v-for="(menu, i) in menuLists" :key="i">
            <v-card class="card-wrapper" elevation="3">
              <v-avatar :size="100">
                <v-img aspect-ratio="1" cover :src="menu.img"></v-img>
              </v-avatar>
              <div class="card-title">
                <span class="text-center">{{ menu.title }}</span>
              </div>
            </v-card>
          </SplideSlide>
        </Splide>

        <v-btn
          v-if="!isEnd"
          icon
          class="custom-arrow next-arrow"
          @click="goNext"
        >
          <span class="arrow-icon">→</span>
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.explore-section {
  padding: 2rem 0;
}

.card-wrapper {
  margin: 0.5rem;
  overflow: hidden;
  background: transparent;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: none !important;
}

.card-wrapper:hover {
  transform: translateY(-4px);
}

.card-title {
  padding: 1rem;
  text-align: center;
  font-weight: 500;
}

.custom-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: white !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.prev-arrow {
  left: -20px;
}

.next-arrow {
  right: -20px;
}

.arrow-icon {
  font-size: 24px;
  line-height: 1;
}
</style>




