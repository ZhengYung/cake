<script setup>
const props =
    defineProps({
        id: {
            type: String,
            required: true
        }
    })
</script>

<template>
    <!-- 測試時在最外層div 移除fade & 添加d-block -->
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header d-block text-end border-0">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    <slot name="title"></slot>
                </div>
                <div class="modal-body">
                    <slot name="modal-body"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.modal-content{
    max-width: 400px;
    border-radius: 0;
}
.modal-body {
    padding: 0 40px 30px;
}
</style>