<script setup>
import sectionVue from '@/components/section.vue';
</script>

<template>
  <main>
    <h1>首頁</h1>
    <div class="section1">
      <sectionVue :fontSize="'58px'" :pb="'30px'">
          <template #first class="test">TProducts</template>

        <template #second>精選產品推薦</template>
      </sectionVue>
    </div>
    <div class="section2">
      <sectionVue :fontSize="'38px'" :pb="'30px'">

        <template #first>TProducts</template>

        <template #second>精選產品推薦</template>
      </sectionVue>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.section1 {
  margin: 0 auto;
  max-width: 620px;
  // outline: 1px black solid;
}

@media (max-width: 768px) {
  .section1 {
    max-width: 350px;
  }
}

.section2 {
  margin: 0 auto;
  max-width: 450px;
  // outline: 1px black solid;
}

@media (max-width: 768px) {
  .section2 {
    max-width: 350px;
  }
}
</style>