<script setup>
const props =
    defineProps({
        fontSize: {
            type: String,
            required: true//要求父組件必須提供此prop值
        },
        pb: {
            type: String,
            required: true
        }
    })

</script>

<template>
    <div class="sectionWrap container-fluid" :style="{ paddingBottom: pb }">
        <div class="row">
            <div class="col-3 p-0">
                <img src="@/assets/img/penguin1.png" alt="" :style="{ translate: `0 calc(${pb}/2)` }">
            </div>
            <div class="col-9 d-flex flex-column justify-content-center">
                <em class="m-0 text-uppercase" :style="{ fontSize: fontSize }">
                    <slot name="first">XXXXXXX</slot>
                </em>
                <h2 class="m-0" :style="{ fontSize: fontSize }">
                    <slot name="second">xxxxxx</slot>
                </h2>
            </div>
        </div>
    </div>
    <svg width="0" height="0" class="position-absolute">
        <defs>
            <clipPath id="topLine" clipPathUnits="objectBoundingBox">
                <path d="M1 0 L0 0  L .01 .7 L 1 1  z" />
            </clipPath>
            <clipPath id="bottomLine" clipPathUnits="objectBoundingBox">
                <path d="M0 0 L .99 0 L 1 .7 L 0 1 z" />
            </clipPath>
        </defs>
    </svg>
</template>

<style scoped lang="scss">
.sectionWrap {
    display: flex;
    position: relative;

    &::after {
        position: absolute;
        left: -40px;
        bottom: 0;
        content: '';
        width: 90%;
        background: var(--secColor);
        height: 10%;
        clip-path: url(#bottomLine);
    }

    @media(max-width:768px) {
        &::after {
            height: 10px;
            bottom: 5px;
        }
    }

    em,
    h2 {
        line-height: 1;
    }

    @media (max-width: 768px) {

        em,
        h2 {
            font-size: 22px !important;
        }
    }

    em {
        display: flex;
        align-items: center;
        column-gap: 15px;
        font-family: "Bangers";

        &::after {
            display: block;
            content: "";
            flex: 1 0 0;
            height: 30%;
            background-color: var(--firstColor);
            clip-path: url(#topLine);
        }

        @media(max-width:768px) {
            &::after {
                height: 8px;
            }
        }
    }

    h2 {
        position: relative;
        top: 10px;
        font-weight: 700;
    }


}
</style>
