<script setup>

//vue
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue';
import router from '@/router';

//components元件
import Ham from '@/components/Ham.vue';
import ModalBox from '@/components/ModalBox.vue';
import DefaultBtn from '@/components/DefaultBtn.vue';
import MoreBtn from '@/components/MoreBtn.vue';
//store
import { useCartStore } from '@/stores/cart';
const cartStore = useCartStore();
//切換頁面時將 navbarMenu & 漢堡選單 改為關閉狀態
function hideMenu() {
    const navbarMenu = document.querySelector('#navbarMenu');
    const svg = document.querySelector('.topNav__toggler svg');

    navbarMenu.classList.remove('show');
    svg.classList.remove('active');
}
//登入按鈕事件
function login() {
    console.log('loginBtn Click');
}
//監測windw scroll-bar 位置
const scrollY = ref(window.scrollY);
const handleScroll = () => {
    scrollY.value = window.scrollY;
};

//註冊按鈕事件
function register() {
    router.push({ name: 'register' });
}
const [loginArea, forgetArea] = [ref(null), ref(null)];
function forgetAreaAnimationEnd() {
    forgetArea.value.classList.add('d-none');
    forgetArea.value.classList.remove('d-block');
    loginArea.value.classList.add('d-block');
    loginArea.value.classList.remove('d-none');
    forgetArea.value.classList.remove('modalBodySlideDown');
    forgetArea.value.removeEventListener('animationend', forgetAreaAnimationEnd);
}
function loginModalChange() {
    if (loginArea.value.classList.contains('d-block')) {
        loginArea.value.classList.remove('d-block');
        loginArea.value.classList.add('d-none');
        forgetArea.value.classList.remove('d-none');
        forgetArea.value.classList.add('d-block');
        forgetArea.value.classList.add('modalBodySlideUp');

    }
    else {
        forgetArea.value.addEventListener('animationend', forgetAreaAnimationEnd);
        forgetArea.value.classList.remove('modalBodySlideUp');
        forgetArea.value.classList.add('modalBodySlideDown');
    }

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
        <ModalBox :id="'loginModal'">
            <template #modal-body>
                <div ref="loginArea" class="login d-block">
                    <h2 class="mb-4 text-center fs-6 fw-normal text-muted">會員登入</h2>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="login_account" placeholder="">
                        <label for="login_account" class="text-muted">帳號</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" id="login_pwd" placeholder="">
                        <label for="login_pwd" class="text-muted">密碼</label>
                    </div>
                    <div class="btnBox">
                        <MoreBtn @click="login" :bg="'var(--secColor)'">登&emsp;入</MoreBtn>
                        <DefaultBtn class="fs-6" :bg="'var(--fbColor)'">使用facebook登入</DefaultBtn>
                    </div>
                    <div class="quickBackBox">

                        <button type="button" @click="register" data-bs-dismiss="modal">立即加入</button>
                        <button type="button" @click="loginModalChange">忘記密碼?</button>
                    </div>
                </div>
                <div ref="forgetArea" class="forget d-none">
                    <h2 class="mb-4 text-center fs-6 fw-normal text-muted">忘記密碼</h2>
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="forget_email" placeholder="">
                        <label for="forget_email" class="text-muted">電子信箱</label>
                    </div>
                    <div class="btnBox">
                        <MoreBtn @click="login" :bg="'var(--secColor)'">確&emsp;認</MoreBtn>
                    </div>
                    <div class="quickBackBox">
                        <button type="button" @click="loginModalChange">返回登入</button>
                    </div>
                </div>
            </template>
        </ModalBox>
        <ModalBox :id="'orderModal'">
            <template #title>
                <h2 class="fs-6 fw-normal text-center">訂單查詢</h2>
            </template>
            <template #modal-body>
                <div class="order">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="order" placeholder="">
                        <label for="order" class="text-muted">訂單編號</label>
                    </div>
                    <div class="form-floating">
                        <input type="number" class="form-control" id="order_phone" placeholder="">
                        <label for="order_phone" class="text-muted">手機號碼</label>
                    </div>
                    <div class="btnBox">
                        <MoreBtn @click="login" :bg="'var(--secColor)'">查&emsp;詢</MoreBtn>
                    </div>
                </div>
            </template>
        </ModalBox>
        <ModalBox :id="'cartModal'">

            <template #title>
                <div class="cartTitle">
                    <h2>你的購物車總計<span>{{ cartStore.count }}</span>件商品</h2>
                </div>
            </template>

            <template #modal-body>

            </template>
        </ModalBox>
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

                    <button type="button" class="bg-transparent p-0 border-0" data-bs-toggle="modal"
                        data-bs-target="#loginModal"><i class="fa-regular fa-user"></i>
                    </button>
                    <div class="dropdown loginDropdown">
                        <button class="dropdown-toggle loginDropdownBtn" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                        </button>
                        <v-list class="dropdown-menu position-absolute" density="comfortable" nav>
                            <v-list-item to="/memberinfo/1" title="會員中心" value="MemberCenter"></v-list-item>
                            <v-list-item to="/admin/salesOverview" title="後臺管理" value="Admin"></v-list-item>
                            <v-list-item title="登出" value="Logout"></v-list-item>
                        </v-list>
                    </div>
                    <button type="button" class="bg-transparent p-0 border-0" data-bs-toggle="modal"
                        data-bs-target="#orderModal"><i class="fa-solid fa-book"></i>
                    </button>
                    <button type="button" class="cart bg-transparent p-0 border-0" :data-count="cartStore.count"
                        data-bs-toggle="modal" data-bs-target="#cartModal"><i
                            class="fa-solid fa-cart-shopping"></i></button>
                </div>
                <button class="topNav__toggler navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarMenu" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <Ham />
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
                                :aria-current="$route.name === 'products' || $route.name === 'product-detail' ? 'page' : null">
                                產品介紹
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/faq" @click="hideMenu" :class="[{ active: $route.name === 'faq' }]"
                                :aria-current="$route.name === 'faq' ? 'page' : null">購物須知</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/contact" @click="hideMenu"
                                :class="[{ 'active': $route.name === 'contact' }]"
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
<script>
export default {
    data: () => ({
        fav: true,
        menu: false,
        message: false,
        hints: true,
    }),
}
</script>
<style lang="scss" scoped>
//覆寫bootstrap start
.form-control:focus {
    box-shadow: none;
}

.login,
.forget,
.order {

    .form-floating>.form-control,
    .form-floating>.form-control-plaintext,
    .form-floating>.form-select {
        height: 3rem;
        min-height: unset;
    }

    .form-floating>label {
        background: white;
        height: auto;
        padding: 0;
        translate: 1rem 80%;
        line-height: 1;
    }

    .form-floating>.form-control-plaintext~label::after,
    .form-floating>.form-control:focus~label::after,
    .form-floating>.form-control:not(:placeholder-shown)~label::after,
    .form-floating>.form-select~label::after {
        content: none;
    }

    .form-floating>.form-control-plaintext~label,
    .form-floating>.form-control:focus~label,
    .form-floating>.form-control:not(:placeholder-shown)~label,
    .form-floating>.form-select~label {
        transform: scale(.85) translateY(-1.6rem) translateX(.15rem);
    }

    .form-floating>.form-control-plaintext:focus,
    .form-floating>.form-control-plaintext:not(:placeholder-shown),
    .form-floating>.form-control:focus,
    .form-floating>.form-control:not(:placeholder-shown) {
        padding-top: 0;
        padding-bottom: 0;
    }
}


//覆寫bootstrap end

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

.btnBox {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 20px;
    margin-top: 25px;

    button {
        flex: 1 0 0px;
        max-width: 160px;
    }
}

.quickBackBox {
    margin-top: 20px;
    display: flex;
    justify-content: end;

    * {
        color: gray;
        line-height: 1;
        border: none;
        background-color: unset;
        padding: 0 6px;
    }

    @media (hover:hover) {
        *:hover {
            color: black;
        }

        :nth-child(2) {
            position: relative;

            &::before {
                content: '';
                position: absolute;
                display: block;
                left: 0;
                top: 0;
                bottom: 0;
                width: 1px;
                height: 100%;
                background-color: gray;
            }
        }
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

        .loginDropdownBtn {
            display: flex;

            &::after {
                content: "\f007";
                font-weight: 400;
                font-family: "Font Awesome 6 Free";
                border: none;
            }
        }

        .loginDropdown .dropdown-menu {
            display: block;
            transition: all 0.2s ease-out 0s;
            transform-origin: left top;
            scale: 0;

            &.show {
                scale: 1;
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
                align-items: center;
                font-size: 12px;
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

.cartTitle {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 10px;

    &::before {
        content: "\f07a";
        font-weight: 900;
        font-family: "Font Awesome 6 Free";
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        scale: -1 1;
        background-color: var(--secColor);
        border-radius: 50%;
        font-size: 18px;
        width: 40px;
        aspect-ratio: 1;
    }

    h2 {
        font-size: 1.2rem;
        font-weight: normal;
        margin: 0;

        span {
            color: var(--secColor);
            margin: 0 8px;
        }
    }
}

//Animations
.modalBodySlideUp {
    animation: modalBodySlideUp 0.2s ease-out 0s;
}

.modalBodySlideDown {
    animation: modalBodySlideDown 0.2s ease-out 0s;
}

@keyframes modalBodySlideUp {
    0% {
        transform: translateY(100%);
    }

    100% {
        transform: translateY(0%);
    }
}

@keyframes modalBodySlideDown {
    0% {
        transform: translateY(0%);
    }

    100% {
        transform: translateY(100%);
    }
}
</style>
