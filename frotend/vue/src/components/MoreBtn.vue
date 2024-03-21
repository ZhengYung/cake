<script setup>
import DefaultBtn from './DefaultBtn.vue';
defineProps({
    bg: {
        type: String,
        required: true
    }
})

</script>

<template>
    <DefaultBtn :bg="bg" class="moreBtn">
        <slot></slot>
    </DefaultBtn>
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
