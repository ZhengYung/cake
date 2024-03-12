<script setup>
import { ref } from 'vue';
</script>
<template>
    <v-list density="comfortable" nav>
        <v-list-group value="Admin">
            <template #activator="{ props }">
                <v-list-item v-bind="props" title="頁面管理"></v-list-item>
            </template>

            <v-list-item v-for="([title, icon], i) in admins" :key="i" :prepend-icon="icon" :title="title"
                :value="title"></v-list-item>
        </v-list-group>
    </v-list>
</template>
<style scoped lang="scss"></style>