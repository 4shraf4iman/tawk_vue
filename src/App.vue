<template>
	<div>
	  <tawk-header></tawk-header>
	  <div class="searchbar-container">
		<tawk-searchbar @search="handleSearch"></tawk-searchbar>
	  </div>
	  <router-view :searchQuery="searchQuery"></router-view>
	</div>
  </template>
  
  <script>
  import Header from './components/Header.vue';
  import SearchBar from './components/SearchBar.vue';
  import { ref } from 'vue';
  
  export default {
	components: {
	  'tawk-header': Header,
	  'tawk-searchbar': SearchBar
	},
	setup() {
	  const searchQuery = ref('');
  
	  const handleSearch = (query) => {
		searchQuery.value = query;
	  };
  
	  return {
		searchQuery,
		handleSearch
	  };
	}
  };
  </script>
  
  <style lang="scss" scoped>
  @import 'scss/main.scss';
  
  .searchbar-container {
	display: flex;
	justify-content: center; 
	margin-top: 20px; 
  }
  </style>
  