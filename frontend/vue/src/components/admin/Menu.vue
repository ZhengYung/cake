<script setup>
import { ref } from 'vue';
const open = ref([]);

</script>
<template>
    <v-list v-model:opened="open" density="comfortable" nav>
        <v-list-item to="/admin/salesOverview" prepend-icon="fa-solid fa-chart-line" title="銷售總覽"
            value="SalesOverview"></v-list-item>
        <v-divider></v-divider>

        <v-list-subheader title="頁面管理" :style="'font-size:1rem; padding-inline:0 !important;'"></v-list-subheader>
        <v-list-item to="/admin/story" prepend-icon="fa-solid fa-pager" title="品牌故事" value="Story"></v-list-item>
        <v-list-group value="News">
            <template #activator="{ props }">
                <v-list-item :class="{ 'currentGroup': $route.path.startsWith('/admin/news') }"
                    prepend-icon="fa-regular fa-newspaper" v-bind="props" title="消息管理"></v-list-item>
            </template>
            <v-list-item to="/admin/newsLayer" prepend-icon="fa-regular fa-circle" title="類別"
                value="NewsLayers"></v-list-item>
            <v-list-item to="/admin/news" prepend-icon="fa-regular fa-circle" title="消息"
                value="NewsItems"></v-list-item>
        </v-list-group>
        <v-list-group value="Prodct">
            <template #activator="{ props }">
                <v-list-item :class="{ 'currentGroup': $route.path.startsWith('/admin/product') }"
                    prepend-icon="fa-solid fa-cookie-bite" v-bind="props" title="產品管理"></v-list-item>
            </template>
            <v-list-item to="/admin/productLayer" prepend-icon="fa-regular fa-circle" title="類別"
                value="ProductLayers"></v-list-item>
            <v-list-item to="/admin/product" prepend-icon="fa-regular fa-circle" title="產品品項"
                value="Product"></v-list-item>
            <v-list-item to="/admin/product-flavor" prepend-icon="fa-regular fa-circle" title="產品口味"
                value="ProductFlavor"></v-list-item>
        </v-list-group>
        <v-list-group value="FAQ">
            <template #activator="{ props }">
                <v-list-item :class="{ 'currentGroup': $route.path.startsWith('/admin/faq') }"
                    prepend-icon="fa-solid fa-clipboard-question" v-bind="props" title="購物須知"></v-list-item>
            </template>
            <v-list-item to="/admin/faqLayer" prepend-icon="fa-regular fa-circle" title="類別"
                value="FAQLayers"></v-list-item>
            <v-list-item to="/admin/faq" prepend-icon="fa-regular fa-circle" title="FAQ" value="FAQItems"></v-list-item>
        </v-list-group>
        <v-divider></v-divider>

        <v-list-item to="/admin/order" prepend-icon="fa-solid fa-book" title="訂單管理" value="Order"></v-list-item>
        <v-divider></v-divider>

        <v-list-subheader title="會員管理" :style="'font-size:1rem; padding-inline:0 !important;'"></v-list-subheader>
        <v-list-item to="/admin/memberLevel" prepend-icon="fa-solid fa-ranking-star" title="會員等級"
            value="MemberLevel"></v-list-item>
        <v-list-item to="/admin/member" prepend-icon="fa-solid fa-users" title="會員清單" value="MemberList"></v-list-item>
        <v-list-item to="/admin/memberAnalyze" prepend-icon="fa-solid fa-magnifying-glass-chart" title="會員分析"
            value="MemberAnalyze"></v-list-item>
        <v-divider></v-divider>

        <v-list-subheader title="管理者" :style="'font-size:1rem; padding-inline:0 !important;'"></v-list-subheader>
        <v-list-item to="/admin/adminLevel" prepend-icon="fa-solid fa-ranking-star" title="管理等級"
            value="AdminLevel"></v-list-item>
        <v-list-item to="/admin/admin" prepend-icon="fa-solid fa-users" title="管理者清單" value="AdminList"></v-list-item>
    </v-list>
</template>
<style lang="scss">
.v-list-item__prepend {

    >.v-badge~.v-list-item__spacer,
    >.v-icon~.v-list-item__spacer,
    >.v-tooltip~.v-list-item__spacer {
        display: none !important;
    }
}

.v-list-item--active>.v-list-item__overlay {
    color: blue;
}
</style>
<style scoped lang="scss">
.v-list-item--nav {
    padding-inline: 0 !important;
}

.v-list-group__items .v-list-item {
    padding-inline-start: 0.6rem !important;
}

.v-list-item--nav {
    column-gap: 10px !important;
}

.currentGroup {
    background: rgb(39, 39, 109) !important;

    :deep(*) {
        color: white;
    }
}
</style>
<style scoped lang="scss"></style>