<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import ham from './components/ham.vue';
import modalBox from './components/modalBox.vue';
import { ref, onMounted, onUnmounted } from 'vue';

//store
import { useCounterStore } from '@/stores/counter';
const counterStore = useCounterStore();
const scrollY = ref(window.scrollY);

const handleScroll = () => {
  scrollY.value = window.scrollY;
};
function hideMenu() {
  const navbarMenu = document.querySelector('#navbarMenu');
  const svg = document.querySelector('.topNav__toggler svg');
  navbarMenu.classList.remove('show');
  svg.classList.remove('active');
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <Teleport to="body">
    <modalBox :id="'loginModal'"></modalBox>
    <modalBox :id="'orderModal'"></modalBox>
    <modalBox :id="'cartModal'"></modalBox>
  </Teleport>
  <header
    :class="[{ isTop: scrollY === 0 && $route.name === 'home' }, $route.name === 'home' ? 'position-fixed w-100' : 'position-sticky', 'top-0']"
    style="z-index: 999;">
    <nav class="topNav navbar navbar-expand-lg p-0">
      <div class="container-fluid" style="max-width: 1400px;">
        <RouterLink to="/" @click="hideMenu" class="logo navbar-brand me-auto">
          <h1>Logo</h1>
        </RouterLink>

        <div class="topNav__funcBox">
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
        <button class="topNav__toggler navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarMenu" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <ham />
        </button>
        <div class="topNav__collapse navbar-collapse collapse" id="navbarMenu">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink to="/about" @click="hideMenu" :class="[{ active: $route.name === 'about' }]"
                :aria-current="$route.name === 'about' ? 'page' : null">
                品牌故事
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/news" @click="hideMenu" :class="[{ active: $route.name === 'news' }]"
                :aria-current="$route.name === 'news' ? 'page' : null">最新消息</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/products" @click="hideMenu"
                :class="[{ 'active': $route.name === 'products' || $route.name === 'product-detail' }]"
                :aria-current="$route.name === 'products' || $route.name === 'product-detail' ? 'page' : null">產品介紹
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/faq" @click="hideMenu" :class="[{ active: $route.name === 'faq' }]"
                :aria-current="$route.name === 'faq' ? 'page' : null">購物須知</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/contact" @click="hideMenu" :class="[{ 'active': $route.name === 'contact' }]"
                :aria-current="$route.name === 'contact' ? 'page' : null">聯絡我們
              </RouterLink>
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
.banner {
  clip-path: url('#bannerClip');
  background-size: cover;
  background-position: center right;
  // transition: none;
  transition: background-image 0.5s ease-out 0s;

  &.home {
    height: 95vh;
    background-image: url('@/assets/img/banner1.jpg');
    background-size: cover;
    background-position: bottom right;
    background-attachment: fixed;
  }

  &.about,
  &.news,
  &.contact {
    height: 50vh;
    background-image: url('@/assets/img/banner2.jpg');
  }


}

header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  * {
    color: var(--firstColor);
  }

  .topNav__collapse * {
    color: white;
  }

  &.isTop {
    background-color: transparent;
    box-shadow: unset;

    * {
      color: white;
    }

    .topNav__toggler :deep(svg path) {
      stroke: white;
    }

    .topNav__collapse .nav-item a {
      text-shadow: 0 0 10px #2721b59e;
    }
  }
}

.topNav {

  &__funcBox,
  &__toggler {
    order: 1;
  }

  &__collapse {
    order: 1;
    margin: 0 -15px;
    transition: none;

    &.show ul {
      background-color: var(--firstColor);
    }

    ul {
      height: 100vh;
      text-align: center;
      margin: 0 auto;

      li {
        display: flex;
        justify-content: center;
        align-items: center;

        a {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          --bs-link-color-rgb: 0, 0, 0;
          padding: 10px 18px;

          &::after {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 0 auto;
            display: block;
            content: '';
            background-color: var(--secColor);
            width: 0;
            height: 0;
          }

          &.active::after {
            width: 80%;
            height: 5px;
          }

          @media (hover:hover) {
            &:hover::after {
              width: 80%;
              height: 5px;
            }
          }
        }
      }
    }
  }

  &__funcBox {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 30px;
    font-size: 1.5rem;

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

  &__toggler {
    margin-left: 40px;
    padding: 0;
    border: none;

    &:focus {
      box-shadow: none;
    }
  }
}

@media (min-width: 992px) {
  header:not(.isTop) {
    .topNav__collapse * {
      color: black;
    }
  }

  .navbar-expand-lg .navbar-collapse.topNav__collapse {
    order: 0;
    margin: unset;

    ul {
      transition: none;
      height: auto;
      background-color: unset;
    }
  }
}
</style>
