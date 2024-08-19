<template>
    <div class="home">
      <div class="category-grid">
        <router-link
        v-for="category in displayedCategories"
        :key="category.id || 'placeholder-' + category.index"
        :to="!category.placeholder ? { name: 'Category', params: { id: category.id } } : '#' "
        class="category-box"
        :class="{ placeholder: category.placeholder }"
      >
          <div v-if="!category.placeholder" class="category-icon">
            <i :class="`fa-solid fa-${category.icon}`"></i>
           
          </div>
          <div v-if="!category.placeholder">
            <h2>{{ category.title }}</h2>
            <h5 style="margin:  0; padding: 0;">Total Articles: {{ category.totalArticle }}</h5>
            <h6 style="margin: 4; padding: 0;color:grey!important">Last update: {{ getRelativeTime(category.updatedOn) }}</h6>

          </div>
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import { differenceInDays, parseISO, differenceInYears } from 'date-fns';
  
  export default {
    name: 'Home',
    props: {
      searchQuery: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      const categories = ref([]);
      const totalCategoryCount = 9; // Total number of grid cells you want
  
      // Fetch categories on mount
      onMounted(async () => {
        try {
          const response = await axios.get('http://localhost:9000/api/categories');
          categories.value = response.data;
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      });
  
      // Compute only enabled categories and filter by search query
      const filteredCategories = computed(() => {
        return categories.value
          .filter(category => category.enabled)
          .filter(category => {
            const title = category.title.toLowerCase();
            const query = props.searchQuery.toLowerCase();
            return title.includes(query);
          });
      });
  
      const displayedCategories = computed(() => {
        const result = filteredCategories.value.map(category => ({ ...category, placeholder: false }));
        const placeholdersNeeded = totalCategoryCount - result.length;
        for (let i = 0; i < placeholdersNeeded; i++) {
          result.push({ placeholder: true, index: i });
        }
        return result;
      });
  
      // Function to get relative time in days or years
      const getRelativeTime = (dateString) => {
        try {
          const date = parseISO(dateString); // Parse ISO date string
          const today = new Date(); // Current date
          const diffDays = differenceInDays(today, date); // Difference in days
          const diffYears = differenceInYears(today, date); // Difference in years
  
          if (diffYears > 0) {
            return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
          }
          if (diffDays === 0) return 'Today';
          if (diffDays === 1) return 'Yesterday';
          return `${diffDays} days ago`;
        } catch (error) {
          console.error('Failed to parse date:', error);
          return 'Unknown';
        }
      };
  
      return {
        displayedCategories,
        getRelativeTime
      };
    }
  };
  </script>
  
  <style scoped>

  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');

  body {
    font-family: 'Lato', sans-serif;
  } 
  .home {
    padding: 40px;
    background-color: #f0f0f0;
    margin: 0 120px; 
  }
  
  .category-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px; 
    padding:60px;
  }
  
  .category-box {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 40px;
    flex: 1 1 calc(33.333% - 20px); 
    box-sizing: border-box;
    min-height: 150px; 
    text-decoration: none;
    color: #000;
  }
  
  .category-box h2,h6 {
    margin-top: 0;
    text-align: center;
    font-family: Lato;
  }
  
  .category-icon {
    font-size: 74px; 
    margin-bottom: 10px;
    color:#03A84E;
    text-align: center; 
    margin-bottom:10%;
  }
  
  h5 {
    text-align: center;
    color: green; 
    font-family: Lato;
    font-size:13px;
  }

  h6{
    color:grey;
  }

  .category-box.placeholder {
    background-color: #f0f0f0;
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
  }

  </style>
  