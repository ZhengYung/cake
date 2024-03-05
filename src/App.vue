<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted, onUnmounted } from 'vue';

//store
import { useCounterStore } from '@/stores/counter';
const counterStore = useCounterStore();
const scrollY = ref(window.scrollY);

const handleScroll = () => {
  scrollY.value = window.scrollY;
};
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header
    :class="[{ isTop: scrollY === 0 && $route.name === 'home' }, $route.name === 'home' ? 'position-fixed w-100' : 'position-sticky']"
    style="z-index: 999;">
    <nav class="topNav navbar navbar-expand-lg">
      <div class="container-fluid">
        <RouterLink to="/" class="logo navbar-brand me-auto">
          <h1>Logo</h1>
        </RouterLink>

        <div class="funcBox">
          <a href="#" target="_blank"><i class="fa-brands fa-square-facebook"></i></a>
          <a href="#" target="_blank"><i class="fa-brands fa-instagram"></i></a>

          <button class="bg-transparent p-0 border-0" type="button" data-bs-toggle="modal"
            data-bs-target="#loginModal"><i class="fa-regular fa-user"></i>
          </button>

          <button class="bg-transparent p-0 border-0" type="button" data-bs-toggle="modal"
            data-bs-target="#orderModal"><i class="fa-solid fa-book"></i>
          </button>
          <button type="button" class="cart bg-transparent p-0 border-0" :data-count="counterStore.count"
            data-bs-toggle="modal" data-bs-target="#cartModal"><i class="fa-solid fa-cart-shopping"></i></button>
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <svg class="ham hamRotate ham8" viewBox="0 0 100 100" width="80" onclick="this.classList.toggle('active')">
            <path class="line top"
              d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20" />
            <path class="line middle" d="m 30,50 h 40" />
            <path class="line bottom"
              d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20" />
          </svg>
        </button>
        <div class="navbar-collapse collapse" id="navbarMenu">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink to="/about" :class="[{ active: $route.name === 'about' }]" aria-current="page">
                品牌故事
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/news" :class="[{ active: $route.name === 'news' }]">最新消息</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/products"
                :class="[{ 'active': $route.name === 'products' || $route.name === 'product-detail' }]">產品介紹
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/faq" :class="[{ active: $route.name === 'faq' }]">購物須知</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/contact" :class="[{ 'atcive': $route.name === 'contact' }]">聯絡我們</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <svg width="0" height="0" class="position-absolute">
    <defs>
      <clipPath id="bannerClip" clipPathUnits="objectBoundingBox">
        <path d="M0 0 L0 1  L 1 .9  L 1 0  z" />
      </clipPath>
    </defs>
  </svg>
  <div :class="['banner', $route.name]"></div>
  <main>
    <RouterView />
  </main>
  <footer>
    <div class="footer__item"></div>
    <div class="footer__item"></div>
  </footer>
</template>

<style lang="scss" scoped>
.ham {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 400ms;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.hamRotate.active {
  transform: rotate(45deg);
}

.line {
  fill: none;
  transition: stroke-dasharray 400ms, stroke-dashoffset 400ms;
  stroke: #000;
  stroke-width: 5.5;
  stroke-linecap: round;
}

.ham8 .top {
  stroke-dasharray: 40 160;
}

.ham8 .middle {
  stroke-dasharray: 40 142;
  transform-origin: 50%;
  transition: transform 400ms;
}

.ham8 .bottom {
  stroke-dasharray: 40 85;
  transform-origin: 50%;
  transition: transform 400ms, stroke-dashoffset 400ms;
}

.ham8.active .top {
  stroke-dashoffset: -64px;
}

.ham8.active .middle {
  //stroke-dashoffset: -20px;
  transform: rotate(90deg);
}

.ham8.active .bottom {
  stroke-dashoffset: -64px;
}

.banner {
  clip-path: url('#bannerClip');

  &.about,
  &.news,
  &.contact {
    height: 50vh;
    background-image: url('@/assets/img/banner2.jpg');
    background-size: cover;
    background-position: center right;
  }

  &.home {
    height: 90vh;
    background-image: url('@/assets/img/banner1.jpg');
    background-size: cover;
    background-position: bottom right;
  }
}

.funcBox,
.navbar-toggler {
  order: 1;
}


.navbar-collapse {
  order: 1;
  background-color: var(--firstColor);
  margin: 0 -52px;

  ul {
    height: 100vh;
    text-align: center;

    li {
      display: flex;
      justify-content: center;
      align-items: center;

      a {
        --bs-link-color-rgb: 0, 0, 0;
      }
    }
  }
}

@media (min-width: 992px) {
  .navbar-expand-lg .navbar-collapse {
    order: 0;
    background-color: unset;
    padding: unset;
    margin: unset;

    ul {
      height: auto;
    }
  }
}

.topNav {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0 40px;
  transition: background-color 0.5s ease-out 0s, box-shadow 0.5s ease-out 0s, padding 0.5s ease-out 0s;

  .navbar-toggler {
    margin-left: 40px;
    padding: 0;

    &:focus {
      box-shadow: none;
    }
  }

  .funcBox {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 30px;
    font-size: 1.5rem;

    :where(a, button) {
      i {
        color: var(--firstColor);
        transition: color 0.5s ease-out 0s;
      }

      &:hover i {
        color: var(--secColor);
      }
    }

    .cart {
      display: flex;
      justify-content: center;
      align-items: center;
      column-gap: 3px;
      font-size: 1.3rem;

      &::after {
        content: attr(data-count);
        display: flex;
        justify-content: center;
        align-items: flex-end;
        font-size: 1rem;
        line-height: 1;
        width: 18px;
        height: 18px;
        background-color: var(--firstColor);
        color: white;
        border-radius: 50%;
      }
    }
  }
}

.isTop .topNav {
  background-color: transparent;
  box-shadow: none;
  padding-top: 40px;

  :where(a, button) {
    color: white;

    i {
      color: white;
    }

    &:hover i {
      color: var(--firstColor);
    }
  }
}
</style>
