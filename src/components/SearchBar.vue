<template>
    <div class="searchbar">
      <input
        type="text"
        v-model="query"
        @input="onInput"
        placeholder="Search for answers..."
      />
      <button @click="onSearch" class="search-button">
        <i class="fas fa-search"></i>
      </button>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  
  export default {
    name: 'SearchBar',
    setup(props, { emit }) {
      const query = ref('');
  
      const onInput = () => {
        emit('search', query.value);
      };
  
      const onSearch = () => {
        emit('search', query.value);
      };
  
      return {
        query,
        onInput,
        onSearch
      };
    }
  };
  </script>
  
  <style scoped>
  .searchbar {
    display: flex;
    align-items: center;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: #fff;
    overflow: hidden;
    width: 720px;
    margin: 0 auto; 
    margin-bottom:5%;
  }
  
  .searchbar input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px; 
    padding:20px;
    
  }
  
  .searchbar .search-button {
    background-color: #30bd17; 
    border: none;
    padding: 20px;
    cursor: pointer;
    color: white;
    border-radius: 0 4px 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
   
  }
  
  .searchbar .search-button .fa-search {
    font-size: 18px; 
  }
  
 
  </style>
  