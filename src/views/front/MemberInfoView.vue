<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const tab = ref('null');
const test = ref(0);
setTimeout(() => {
  test.value = 30;
}, 100);

tab.value = route.params.tabs;
</script>

<template>
  <main class="pt-5">
    <v-card class="m-auto" color="basil" max-width="80vw">
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold text-h2 text-basil">
          會員中心
        </h1>
      </v-card-title>

      <v-tabs v-model="tab" bg-color="transparent" color="basil" grow>
        <v-tab value="1">個人資訊</v-tab>
        <v-tab value="2">購物金</v-tab>
        <v-tab value="3">訂單</v-tab>
        <v-tab value="4">追蹤清單</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="1">
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="8">
                <div class="d-flex column-gap-2 mb-2">
                  <i class="fa-regular fa-face-smile d-flex align-items-center fs-5"></i>
                  <p class="m-0 fs-5">Member Name</p>
                  <v-chip variant="elevated" color="orange" class="memberLevel" append-icon="fa-solid fa-star"
                    text="會員等級" />
                  <v-btn color="transparent" flat>查看會員等級規則</v-btn>

                  <v-tooltip>
                    <template v-slot:activator="{ props }">
                      <p class="m-0 text-primary d-flex align-items-center" v-bind="props">查看會員等級規則</p>
                    </template>
                    test
                  </v-tooltip>

                  <!-- <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                      <p :class="[{ 'text-danger': isHovering, 'text-primary': !isHovering }, 'm-0', 'd-flex', 'align-items-center']"
                        v-bind="props">查看會員等級規則</p>
                      <v-tooltip>123</v-tooltip>
                    </template>
                  </v-hover> -->
                </div>
                <div class="d-flex align-items-center column-gap-1 mb-2">
                  <i class="fa-solid fa-flag text-body-tertiary align-self-end fs-5"></i>
                  <p class="m-0">12 個月內累積消費額</p>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <p class="m-0">NT$0</p>
                  <p class="text-body-tertiary m-0">差 NT$2000 升級</p>
                </div>
                <v-progress-linear v-model="test" :height="7" rounded color="cyan"></v-progress-linear>
              </v-col>
            </v-row>
            <v-row></v-row>
          </v-container>
        </v-window-item>

        <v-window-item value="2">
          <v-container fluid>
            2
          </v-container>
        </v-window-item>

        <v-window-item value="3">
          <v-container fluid>
            3
          </v-container>
        </v-window-item>
        <v-window-item value="4">
          <v-container fluid>
            4
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
  </main>
</template>
<style>
/* Helper classes */
.bg-basil {
  background-color: #FFFBE6 !important;
}

.text-basil {
  color: #356859 !important;
}

.bg-orange {
  * {
    color: white;
  }

}

.memberLevel {
  * {
    font-size: 1rem !important;
  }
}
</style>
