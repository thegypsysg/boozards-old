<template>
    <div>
        <div class="pt-100px" :class="{ 'mt-8': !isDesktop }">
        <v-container>
           <v-row>
                <v-col cols="8">
                    <v-card border>
                        <template v-slot:title>
                            <span class="font-weight-black">Delivery Options</span>
                        </template>

                        <v-card-text class="pt-4">
                            
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="4">

                </v-col>
           </v-row>
        </v-container>
        </div>
    </div>
</template>

<style>
    .pt-100px {
        padding-top: 100px;
    }
</style>

<script setup>
    import { ref, onMounted } from "vue";
   
    const isDesktop = ref(true);

    onMounted(() => {
        isDesktop.value = window.innerWidth >= 768;
    });
</script>