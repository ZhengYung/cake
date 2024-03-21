<script setup>

</script>

<template>
  <RouterView />
</template>


<style scoped lang="scss">
:deep(.ck-editor__editable_inline:not(.ck-comment__input *)) {
  height: 300px;
  overflow-y: auto;
}
</style>