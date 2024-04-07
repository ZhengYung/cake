<script setup>
import { ref, inject, onMounted, computed } from 'vue';
const axios = inject('axios');

const list = ref([]);
const layerList = ref([]);
const currentLayer = ref("");

const changeCurrent = (Item) => {
  layerList.value.forEach(item => {
    if (item == Item) item.currentLayer = true;
    else item.currentLayer = false;
  });
  currentLayer.value = Item;
}

const showList = computed(() => {
  if (currentLayer.value.Id !== 0)
    return list.value.filter(item => item.LayerId === currentLayer.value.Id);
  return list.value;
});

onMounted(async () => {
  try {
    const res = await axios.get('faq');
    const res2 = await axios.get('faqLayer');
    list.value = res.data;
    res2.data.push(
      {
        Id: 0,
        Name: '全部'
      }
    );
    layerList.value = res2.data.map((item, index, arr) => {
      if (index === arr.length - 1) {
        item.currentLayer = true;
        currentLayer.value = item;
        return item;
      }
      item.currentLayer = false;
      return item;
    });
  } catch (error) {
    console.error('錯誤訊息:', error)
  }

});


</script>

<template>
  <main class="mt-5">
    <v-container >
      <v-row>
        <v-col lg="3">
          <ul class="menu">
            <li @click="changeCurrent(item)" :class="[{ currentLayer: item.currentLayer }, 'menu__item']"
              v-for="item in layerList" :key="item.Id">
              <p class="m-0">{{ item.Name }}</p>
            </li>
          </ul>
        </v-col>
        <v-col lg="1"></v-col>
        <v-col lg="8">
          <v-expansion-panels multiple>
            <v-expansion-panel elevation="0" v-for="(item, index ) in showList">
              <v-expansion-panel-title>
                <template #actions="{ expanded }">
                  <div :class="['toggleOpen', { open: expanded }]"></div>
                </template>
                <p class="m-0 d-flex align-items-center column-gap-2">
                  <span class="faqNum">0{{ index + 1 }}</span>
                  {{ item.Title }}
                </p>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-sheet elevation="1">
                  <div v-html="item.Content" class="ps-4 pe-4 pt-3 pb-3"></div>
                </v-sheet>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </main>

</template>
<style scoped lang="scss">
.menu {
  margin: 0 auto;
  background-color: white;
  border-top: 15px solid #92F3B9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  padding: 20px 0 15px 30px;

  &__item {
    display: flex;
    align-items: baseline;
    cursor: pointer;
    padding: 10px 10px;
    transition: padding-left 0.5s ease-in-out 0s;

    &::before {
      content: ">";
      display: block;
      font-family: "Bangers";
      margin-right: 10px;
      opacity: 0;
      transition: opacity 0.5s ease-in-out 0s;
    }

    &.currentLayer {
      position: relative;
      padding-left: 20px;
      z-index: 1;
      color: white;

      &::before {
        opacity: 1;
      }

      &::after {
        content: '';
        background: #3FBC71;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100% + 15px);
        height: 100%;
        z-index: -1;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 3% 100%);
      }
    }
  }

  @media(hover:hover) {
    &__item:hover {
      padding-left: 20px;

      &::before {
        opacity: 1;
      }
    }
  }
}

.faqNum {
  font-family: "Comic Sans MS", "Noto Sans TC", "微軟正黑體", sans-serif;
  font-size: 30px;
  color: #3FBC71;
  font-weight: bold;
  margin-right: 5px;
}

.v-expansion-panel:not(:first-child)::after {
  border: none;
}

.v-expansion-panel {
  border-bottom: 1px dashed #ccc;
  padding-bottom: 10px;
}

:deep(.v-expansion-panel-title) {
  padding-bottom: 0;

  &:hover>.v-expansion-panel-title__overlay {
    opacity: 0;
  }
}

.toggleOpen {
  width:35px;
  aspect-ratio: 1;
  background: #3FBC71;
  border-radius:3px;
  position:relative;
  display: flex;
  justify-content: center;
  align-items: center;
  &::before {
    content: "";
    position:absolute;
    display: block;
    background:white;
    left:5px;
    right:5px;
    height:4px;
  }
  &::after{
    content:'';
    position: absolute;
    display: block;
    background: white;
    top:5px;
    bottom:5px;
    width: 4px;
    transition:bottom 0.5s ease-in-out 0s;
  }
  &.open::after{
    bottom:100%;
  }
}
</style>