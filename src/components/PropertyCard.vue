<template>
  <div class="property-card">
    <img :src="property.image" alt="Property Image" class="property-image"/>
    <div class="property-details">
      <h3>{{ property.type }}</h3>
      <p>{{ property.count }} Properties</p>
      <a href="#" class="details-link">More Details</a>
    </div>
  </div>
</template>
  
<script>
  export default {
    props: {
      property: Object
    }
  }
</script>
  
<style scoped>
  .property-card {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .property-image {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }
  
  .property-details {
    position: absolute;
    bottom: 10px;
    left: 10px;
    color: white;
  }
  
  .details-link {
    color: #fff;
    text-decoration: none;
    font-weight: bold;
  }
</style>
  