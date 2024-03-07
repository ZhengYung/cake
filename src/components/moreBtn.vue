<script setup>
import defaultBtn from './defaultBtn.vue';
defineProps({
    bg: {
        type: String,
        required: true
    }
})

</script>

<template>
    <defaultBtn :bg="bg" class="moreBtn">
        <slot></slot>
    </defaultBtn>
</template>

<style scoped lang="scss">
.moreBtn {
    font-size: 18px;
    font-weight: bold;
    @media (hover:hover) {
        &:hover::before {
            rotate: z 90deg;
        }
    }

    &::before {
        display: block;
        width: 18px;
        aspect-ratio: 1;
        content: '';
        background-image: linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff);
        background-position: center;
        background-size: 5px 100%, 100% 5px;
        background-repeat: no-repeat;
        font-size: 18px;
    }
}
</style>