<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useDisplay } from 'vuetify'
import Menu from '@/components/admin/Menu.vue'
const drawer = ref(false)
const rail = ref(false)
const { mobile } = useDisplay()

const openDrawer = () => {
    if (!mobile.value) {
        rail.value = !rail.value;
    }
    else {
        rail.value = false;
        drawer.value = !drawer.value;
    }
}
onMounted(() => {
    if (!mobile.value) {
        rail.value = true;
        drawer.value = true;
    }
});
onUnmounted(() => { })

const open = ref(['Users']);
const admins = [
    ['Management', 'mdi-account-multiple-outline'],
    ['Settings', 'mdi-cog-outline'],
]
const cruds = [
    ['Create', 'mdi-plus-outline'],
    ['Read', 'mdi-file-outline'],
    ['Update', 'mdi-update'],
    ['Delete', 'mdi-delete'],
]


</script>

<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" expand-on-hover :rail="rail" rail-width="60">
            <!-- Brand Logo -->
            <v-list>
                <v-list-item prepend-avatar="@/assets/img/AdminLTELogo.png" title="後臺管理"></v-list-item>
            </v-list>
            <!-- v-divider 分隔線 -->
            <v-divider></v-divider>
            <!-- user panel -->
            <v-list>
                <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" title="John Leider"
                    subtitle="sandra_a88@gmailcom"></v-list-item>
            </v-list>
            <v-divider></v-divider>
            <!-- meun -->
            <Menu />
        </v-navigation-drawer>

        <v-app-bar>
            <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
            <v-app-bar-title>Application</v-app-bar-title>
            <v-btn to="/" append-icon="fa-solid fa-shop">
                回前台
                <template v-slot:append>
                    <v-icon color="warning"></v-icon>
                </template>
            </v-btn>
            <v-btn>登出</v-btn>

        </v-app-bar>

        <v-main>
            <RouterView />
        </v-main>
    </v-app>
</template>

<style scoped lang="scss">
:deep(.v-list-item-title) {
    font-size: 16px;
}
</style>