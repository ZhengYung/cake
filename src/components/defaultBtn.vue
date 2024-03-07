<script setup>
defineProps({
    bg: {
        type: String,
        required: true
    }
})

</script>

<template>
    <button type="button" :style="{ backgroundColor: bg }">
        <slot></slot>
    </button>
</template>

<style scoped lang="scss">
button {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 15px;
    border: none;
    height: 60px;
    font-size: 18px;
    color:white;
    @media (hover:hover) {
        &:hover {
            filter: brightness(0.9);
        }
    }
}
</style>