<script setup>
import { ref, inject } from 'vue';
const axios = inject('axios');

const list = ref([]);
const current = ref('');

const changeCurrent = (Item) => {
  list.value.forEach(item => {
    if (item == Item) item.current = true;
    else item.current = false;
  });
  current.value = Item;
}

axios.get('/story')
  .then(res => {
    list.value = res.data.map((item, index) => {
      if (index === 0) {
        item.current = true;
        current.value = item;
        return item;
      }
      item.current = false;
      return item;
    });
  })
  .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
</script>
<template>
  <main>
    <v-container fluid>
      <v-row>
        <v-col lg="3">
          <ul class="menu">
            <li @click="changeCurrent(item)" :class="[{ current: item.current }, 'menu__item']" v-for="item in list"
              :key="item.Id">
              <p class="m-0">{{ item.Title }}</p>
            </li>
          </ul>
        </v-col>
        <v-col lg="9">
          <div class="ps-5">
            <h2 class="title">{{ '#&nbsp' + current.Title }}</h2>
            <div v-html="current.Content"></div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<style scoped lang="scss">
.menu {
  margin: 0 auto;
  background-color: white;
  border-top: 15px solid #92F3B9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  padding: 20px 0 15px 30px;

  &__item {
    display: flex;
    align-items: baseline;
    cursor: pointer;
    padding: 10px 10px;
    transition: padding-left 0.5s ease-in-out 0s;

    &::before {
      content: ">";
      display: block;
      font-family: "Bangers";
      margin-right: 10px;
      opacity: 0;
      transition: opacity 0.5s ease-in-out 0s;
    }

    &.current {
      position: relative;
      padding-left: 20px;
      z-index: 1;
      color: white;

      &::before {
        opacity: 1;
      }

      &::after {
        content: '';
        background: #3FBC71;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100% + 15px);
        height: 100%;
        z-index: -1;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 3% 100%);
      }
    }
  }

  @media(hover:hover) {
    &__item:hover {
      padding-left: 20px;

      &::before {
        opacity: 1;
      }
    }
  }
}

.title {
  font-size: 1.5rem;
  width: fit-content;
  margin-bottom: 20px;
  background-image: linear-gradient(transparent 75%, rgb(250, 195, 31) 0px, rgb(250, 195, 31) 100%);
  background-position-x: 0px;
  background-position-y: 100%;
  background-size: 100% 28px;
  background-repeat: repeat-y;
}

.fade-in-bottom {
  animation: fade-in-bottom .5s ease-in-out both
}

@keyframes fade-in-bottom {
  0% {
    transform: translateY(50px);
    opacity: 0
  }

  100% {
    transform: translateY(0);
    opacity: 1
  }
}
</style>
