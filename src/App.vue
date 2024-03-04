<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted } from 'vue';

//store
import { useCounterStore } from '@/stores/counter';
const counterStore = useCounterStore();

onMounted(() => {
  const btn = document.querySelector('#test');
  btn.addEventListener('click', () => {
    //count++
    counterStore.increment();
    console.log(counterStore.count);
  })
});
</script>

<template>
  <header :class="[$route.name]">
    <nav class="topNav navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <RouterLink to="/" class="logo navbar-brand me-auto">
          <h1>Logo</h1>
        </RouterLink>

        <div class="funcBox">
          <RouterLink to="/"><i class="fa-brands fa-square-facebook"></i></RouterLink>
          <RouterLink to="/"><i class="fa-brands fa-instagram"></i></RouterLink>
          <RouterLink to="/" data-bs-toggle="modal" data-bs-target="#loginModal"><i class="fa-regular fa-user"></i>
          </RouterLink>
          <RouterLink to="/" class="cart" :data-count="counterStore.count" data-bs-toggle="modal"
            data-bs-target="#cartModal"><i class="fa-solid fa-cart-shopping"></i></RouterLink>
        </div>
        <button class="navbar-toggler ms-5" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarMenu">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink to="/about" :class="[{ active: $route.name === 'about' }, 'nav-link']" aria-current="page">
                品牌故事
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/news" :class="[{ active: $route.name === 'news' }, 'nav-link']">最新消息</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/products"
                :class="[{ 'active': $route.name === 'products' || $route.name === 'product-detail' }, 'nav-link']">產品介紹
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/faq" :class="[{ active: $route.name === 'faq' }, 'nav-link']">購物須知</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/contact" :class="[{ 'atcive': $route.name === 'contact' }, 'nav-link']">聯絡我們</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <button type="button" id="test">counterStore</button>
  <main>
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
.funcBox,
.navbar-toggler {
  order: 1;
}

.navbar-collapse {
  order: 1;
}

@media (min-width: 992px) {
  .navbar-expand-lg .navbar-collapse {
    order: 0;
  }
}

.topNav {
  .logo svg {
    width: 110px;
    aspect-ratio: 2;
    fill: var(--firstColor);
    color: #1eb3e5;
  }

  .funcBox {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 30px;
    font-size: 1.5rem;

    a {
      color: var(--firstColor);
      transition: color 0.5s ease-out 0s;

      &:hover {
        color: var(--secColor);
      }
    }

    .cart {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      font-size: 1.3rem;

      &::after {
        content: attr(data-count);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        font-size: 1rem;
        width: 18px;
        height: 18px;
        background-color: var(--firstColor);
        color: white;
        border-radius: 50%;
      }
    }
  }
}
</style>
