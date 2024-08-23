<template>

<div class="result">
<div v-if="query && query.trim() && displayArticles.length > 0" class="article-list">
        <div v-for="article in displayArticles" :key="article.id" class="article-card2">
          <router-link :to="{ name: 'Category', params: { id: article.id } }">
            <div class="article-card-content">
              <div class="article-icon">
                <i class="fa-regular fa-file-lines"></i>
              </div>
              <div class="article-details">
                <h2>{{ article.title }}</h2>
                <p class="date">Updated on {{ formatDate(article.updatedOn) }}</p>
              </div>
              <div class="article-action">
                <i class="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          </router-link>
        </div>
  </div>
</div>
  
  <div class="home">
     <!-- Spinner with Backdrop -->
     <div v-if="loading" class="backdrop">
      <div class="spinner"></div>
    </div>

    <!-- Breadcrumb Navigation -->
    <div v-if="category" class="breadcrumb">
      <router-link to="/">
        <span style="color: green">All Categories</span>
      </router-link>
      &nbsp; <i class="fa-solid fa-chevron-right"></i> &nbsp; {{ category.title }}
    </div>

    <div class="category-grid">
      <div class="category-content">
        <div v-if="category" class="category-box">
          <div class="top-right-icon">
            <i class="fa-regular fa-file-lines"></i>
            <span>{{ category.totalArticle }}</span>
          </div>
          <div v-if="!category.placeholder" class="category-icon">
            <i :class="`fa fa-${category.icon}`"></i>
          </div>
          <h1>{{ category.title }}</h1>
          <div v-if="category.updatedOn">
            <p>Last Update: {{ getRelativeTime(category.updatedOn) }}</p>
            <hr class="separator" />
          </div>
          <div class="description-container">
            <i class="fa-solid fa-circle-info description-icon"></i>
            <div v-if="category.description">
              <p>{{ category.description }}</p>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </div>
     
      <div class="article-list">
        <div  v-for="article in displayArticles" :key="article.id" class="article-card">
          <div class="article-card-content">
            <div class="article-icon">
              <i class="fa-regular fa-file-lines"></i>
            </div>
            <div class="article-details">
              <h2>{{ article.title }}</h2>
              <p class="date">Updated on {{ formatDate(article.updatedOn) }}</p>
            </div>
            <div class="article-action">
              <i class="fa-solid fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr style="width: 100%; height: 2px; background-color: #dbdbdb; border: none; margin-top: 10%; margin-bottom: 5%;"/>


   <h2 style="color:grey;text-align: center;">Other Categories</h2>
    <!-- Swiper Carousel -->
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <swiper :navigation="{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }" :slides-per-view="3" :space-between="50" :modules="modules" class="mySwiper">
          <swiper-slide v-for="cat in filteredCategories" :key="cat.order">
            <router-link :to="{ name: 'Category', params: { id: cat.id } }" class="swiper-slide-link">
              <div class="carousel-box">
                <div class="carousel-icon">
                  <i :class="`fa fa-${cat.icon}`"></i>
                </div>
                <h3 style="margin-bottom:20px">{{ cat.title }}</h3>
                <h5 style="margin:  0; padding: 0;color:green">{{ cat.totalArticle }} articles</h5>
                <h6 style="margin:  0; padding: 0;color:grey">Last Update {{ getRelativeTime(cat.updatedOn) }}</h6>
              </div>
            </router-link>
          </swiper-slide>
         </swiper>
       </div>
       <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { parseISO, format, differenceInDays, differenceInYears } from 'date-fns';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default {
  name: 'Category',
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const category = ref(null);
    const articles = ref([]);
    const otherCategories = ref([]);
    const loading = ref(true);
    const modules = [Navigation];
    const query = ref(props.searchQuery);

    // Fetch data from the API
    const fetchData = async (categoryId) => {
      loading.value = true;
      try {
        const response = await axios.get(`http://localhost:9000/api/categories`);
        const allCategories = response.data;
        category.value = allCategories.find(cat => cat.id === categoryId);
        otherCategories.value = allCategories.filter(cat => cat.id !== categoryId);

        const articlesResponse = await axios.get(`http://localhost:9000/api/category/${categoryId}/articles`);
        articles.value = articlesResponse.data;
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        loading.value = false;
      }
    };

    // Fetch data on mount and when category ID changes
    onMounted(() => {
      fetchData(route.params.id);
    });

    watch(
      () => route.params.id,
      (newId, oldId) => {
        if (newId !== oldId) {
          fetchData(newId);
        }
      }
    );

    // Compute filtered categories
    const filteredCategories = computed(() => {
      return otherCategories.value.filter(cat => cat.enabled);
    });

    // Compute search results based on query
    const searchArticles = computed(() => {
      const queryValue = query.value.trim().toLowerCase();
      return articles.value.filter(article => article.title.toLowerCase().includes(queryValue));
    });

    // Compute display articles based on search query
    const displayArticles = computed(() => {
      const queryValue = query.value.trim();
      return queryValue ? searchArticles.value : [];
    });

    // Function to get relative time in days or years
    const getRelativeTime = (dateString) => {
      try {
        const date = parseISO(dateString);
        const today = new Date();
        const diffDays = differenceInDays(today, date);
        const diffYears = differenceInYears(today, date);

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

    // Format date
    const formatDate = (dateString) => {
      try {
        return format(parseISO(dateString), 'MMMM dd, yyyy');
      } catch (error) {
        console.error('Failed to format date:', error);
        return 'Unknown';
      }
    };

    // Watch for changes in props.searchQuery
    watch(
      () => props.searchQuery,
      (newQuery) => {
        query.value = newQuery;
      }
    );

    return {
      category,
      query,
      searchArticles,
      displayArticles,
      getRelativeTime,
      formatDate,
      filteredCategories,
      loading,
    };
  }
};
</script>

<style>

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
  display: grid;
  grid-template-columns: 30% 60%;
  gap: 10%;
  padding-left:5%;
  padding-right:5%;
  
}

.category-content {
  display: flex;
  flex-direction: column;
}

.date{
  text-align:left;
  color:grey;
}

.category-box {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 40px;
  position: relative;
  width: 100%; 
  box-sizing: border-box; 
}

.top-right-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 19px; 
  color: #03A84E;
}

.top-right-icon i {
  margin-right: 5px; 
}

.category-box h1 {
  margin-top: 0;
  text-align: center; 
  font-family: Lato;
}

.category-icon {
  font-size: 74px; 
  margin-bottom: 10px;
  color: #03A84E;
  text-align: center; 
  margin-bottom: 10%;
}

p {
  text-align: center;
  font-family: Lato;
}

.separator {
  border: none;
  border-top: 1px solid #ddd;
  margin: 20px 0;
}

.description-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 20px;
}

.description-icon {
  font-size: 24px; 
  color: #03A84E;
  margin-bottom: 10px;
}


.articles-list {
  display: flex;
  flex-direction: column;
  align-items: center; 
  margin: 0 auto!important; 
}

.article-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  text-align: left;
}

.article-card2 {
  background-color: white;
  text-decoration: none; 
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  text-align: left;
  width:100%;
  margin:auto;
  margin:0;
}

.article-card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
}

.article-icon {
  font-size: 24px; 
  color: #03A84E;
}

.article-details {
  flex: 1;
  margin: 0 20px;
}

.article-details h2 {
  margin: 0;
  font-size: 18px; 
  text-decoration: none;
}

.result {
  display: grid;
  justify-content: center; 
  width: 100%;
}

.article-details p {
  margin: 5px 0;
  font-size: 14px; 
  text-decoration: none;
}

.breadcrumb {
  font-size: 18px;
  color: grey;
  margin-left: 5%;
  margin-bottom: 3%;
}

.carousel-container {
  margin-top: 30px;
  max-width: 100%;
  position: relative;
}

.carousel-box {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%; 
}

.carousel-icon {
  font-size: 50px;
  margin-bottom: 20px;
  color: #03a84e;
}

.carousel-box h3 {
  margin: 0;
  font-size: 22px;
  color: black;
}

.carousel-box p {
  margin: 10px 0 0;
  font-size: 16px;
  color: grey;
}

.carousel-wrapper {
  position: relative;
  padding-left: 5%;
  padding-right: 5%;
  margin-top: 30px;
}

.category-carousel {
  padding: 0; 
  
}

.swiper-button-next,
.swiper-button-prev {
  color: #03a84e;

 
}

.router-link{
  text-decoration: none!;
}



.swiper-slide-link {
  text-decoration: none;
  color: inherit;
}

.swiper-slide-link:hover {
  text-decoration: none; 
  color: inherit; 
}


.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: 55%;
  transform: translateY(-50%);
  background: white;
  height:60px;
  width:60px;
  color: rgb(173, 172, 172);
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
}

 .swiper-button-next {
  right: -10px;
 
}

 .swiper-button-prev {
  left: -10px;
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999; 
}

.spinner {
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-top: 8px solid #03A84E; 
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


</style>
