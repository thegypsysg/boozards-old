<script setup>
import { onMounted, ref, nextTick, onUnmounted, computed } from 'vue';
import axios from '@/util/axios';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

defineProps({
  desktop: Boolean,
  title: {
    type: String,
    default: 'Whisky'
  },
  viewAll: {
    type: Boolean,
    default: false
  }
})

const splideRef = ref(null);
const isBeginning = ref(true);
const isEnd = ref(false);
const isMobile = ref(false);

const splideOptions = computed(() => ({
  type: isMobile.value ? 'loop' : 'slide',
  perPage: isMobile.value ? 1.5 : 4,
  arrows: false,
  pagination: false,
  gap: isMobile.value ? '1rem' : '2rem',
  drag: true,
  snap: true,
  rewind: false,
  speed: isMobile.value ? 300 : 400,
  dragMinThreshold: 10,
  flickMaxPages: 1,
  wheelMinThreshold: 50,
  padding: { left: 0, right: 0 },
  focus: 0,
  trimSpace: true,
  updateOnMove: true,
  breakpoints: {
    640: {
      perPage: 1.5,
      gap: '1rem',
      padding: { left: 0, right: 0 },
      focus: 0,
      drag: true,
      snap: true,
      speed: 300,
    },
    960: {
      perPage: 2,
    },
    1200: {
      perPage: 4,
    },
  }
}));

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

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

const menuLists =[
  {
    img: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=2070&auto=format&fit=crop',
    title: 'Monkey Shoulders',
    id: 'Monkey Shoulders'

  },
  {
    img: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=2067&auto=format&fit=crop',
    title: 'Chivas Regal',
    id: 'Chivas Regal'
  },
  {
    img: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1887&auto=format&fit=crop',
    title: 'Johnnie Walker',
    id: 'Johnnie Walker'
  },
  {
    img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=2070&auto=format&fit=crop',
    title: 'Ballantines',
    id: 'Ballantines'
  },
  {
    img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
    title: 'Jameson',
    id: 'Jameson'
  },

]

// onMounted(() => {
//   getMenuList();
// });

// async function getMenuList() {
//   const res = await axios.get('/list-biryani-main-categories');
//   menuLists.value = res.data.data.map((item) => ({
//     title: item.category_name,
//     img: item.main_image,
//     id: item.category_name
//   }));
//   console.log(menuLists.value);
// }

function checkMobile() {
  isMobile.value = window.innerWidth <= 640;
  nextTick(() => {
    splideRef.value?.splide?.refresh();
  });
}

const handleMoved = () => {
  if (isMobile.value) {
    nextTick(() => {
      splideRef.value?.splide?.refresh();
    });
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  nextTick(() => {
    const splide = splideRef.value?.splide;
    if (splide) {
      splide.on('moved mounted', handleSlideMove);
      splide.on('moved', handleMoved);
      handleSlideMove();
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);  // Clean up the event listener
});

</script>

<template>
  <div class="nursing-section mt-md-10 mt-sm-2">
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h6 font-weight-bold">{{title}}</h2>
      <v-btn 
        class="text-capitalize font-weight-bold" 
        variant="text"
        height="40"
      >
        <span style="color: #00A4E4">View all</span>
      </v-btn>
    </div>

    <div class="position-relative">
      <v-btn
        v-if="!isMobile && !isBeginning"
        icon
        class="custom-arrow prev-arrow"
        @click="goPrev"
      >
        <span class="arrow-icon">←</span>
      </v-btn>

      <Splide 
        ref="splideRef" 
        :options="splideOptions"
      >
        <SplideSlide v-for="(menu, i) in menuLists" :key="i">
          <v-card class="card-wrapper" elevation="3">
            <v-img
              :src="menu.img"
              height="180"
              cover
              
            ></v-img>
            <div class="card-title">
              <span class="text-center">{{ menu.title }}</span>
            </div>
          </v-card>
        </SplideSlide>
      </Splide>

      <v-btn
        v-if="!isMobile && !isEnd"
        icon
        class="custom-arrow next-arrow"
        @click="goNext"
      >
        <span class="arrow-icon">→</span>
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.nursing-section {
  padding: 2rem 0;
}

.card-wrapper {
  margin: 0.5rem;
  overflow: hidden;
  background: white;
  transition: transform 0.2s ease;
}

.card-wrapper:hover {
  transform: translateY(-4px);
}

.card-title {
  padding: 1rem;
  text-align: center;
  font-weight: 500;
  color: #00A4E4;  /* Using the blue color from your design */
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

.splide-container {
  touch-action: pan-y pinch-zoom;
  -webkit-tap-highlight-color: transparent;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
}

@media (max-width: 640px) {
  .custom-arrow {
    display: none !important;
  }
  
  .splide-container {
    overflow: visible;
    cursor: grab;
    margin: 0;
    padding: 0;
  }
  
  .splide-container:active {
    cursor: grabbing;
  }
  
  .splide__track {
    overflow: visible;
    -webkit-mask-image: -webkit-radial-gradient(white, black); /* Helps with flickering */
  }
  
  .splide__list {
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  .card-wrapper {
    margin: 0.25rem;
    /* width: calc(66.666% - 0.5rem); */
  }

  .v-img {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transform: translateZ(0);
    will-change: transform;
  }
}

.arrow-hidden {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>