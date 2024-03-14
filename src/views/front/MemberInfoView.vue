<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const tab = ref('null');
tab.value = route.params.tabs;

const levelProgress = ref(0);
setTimeout(() => {
  levelProgress.value = 30;
}, 100);
const isEditing = ref(false);
const sex = ref('');

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
                  <v-tooltip>
                    <template v-slot:activator="{ props }">
                      <p class="levelRule" v-bind="props">查看會員等級規則</p>
                    </template>
                    test
                  </v-tooltip>
                </div>
                <div class="d-flex align-items-center column-gap-1 mb-2">
                  <i class="fa-solid fa-flag text-body-tertiary align-self-end fs-5"></i>
                  <p class="m-0">12 個月內累積消費額</p>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <p class="m-0">NT$0</p>
                  <p class="text-body-tertiary m-0">差 NT$2000 升級</p>
                </div>
                <v-progress-linear v-model="levelProgress" :height="7" rounded color="cyan"></v-progress-linear>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="d-flex align-items-center column-gap-1">
                  <i class="fa-solid fa-address-card text-body-tertiary fs-5"></i>
                  <p class="mb-0 me-2">會員資料</p>
                  <v-btn prepend-icon="fa-solid fa-pen-to-square" v-if="!isEditing" @click="isEditing = true">編輯</v-btn>
                  <v-btn prepend-icon="fa-solid fa-ban" v-if="isEditing" @click="isEditing = false">取消</v-btn>
                  <v-btn prepend-icon="fa-solid fa-floppy-disk" v-if="isEditing" @click="isEditing = false">儲存變更</v-btn>
                </div>
              </v-col>
              <v-col cols="12" class="row row-gap-2">
                <div class="col-12 col-lg-6">
                  <div class="row">
                    <div class="col-auto">
                      <label for="name" class="col-form-label">姓名</label>
                    </div>
                    <div class="col-auto flex-lg-grow-1">
                      <input :readonly="!isEditing" type="text" id="name" class="form-control">
                    </div>
                  </div>
                </div>
                <div class="col-12 col-lg-6">
                  <v-radio-group :readonly="!isEditing" hide-details v-model="sex" inline>
                    <v-radio label="男性" value="male"></v-radio>
                    <v-radio label="女性" value="female"></v-radio>
                  </v-radio-group>
                </div>
                <div class="col-12 col-lg-6">
                  <div class="row">
                    <div class="col-auto">
                      <label for="phone" class="col-form-label">手機</label>
                    </div>
                    <div class="col-auto flex-lg-grow-1">
                      <input :readonly="!isEditing" type="text" id="phone" class="form-control">
                    </div>
                  </div>
                </div>
                <div class="col-12 col-lg-6">
                  <div class="row">
                    <div class="col-auto">
                      <label for="email" class="col-form-label">電郵</label>
                    </div>
                    <div class="col-auto flex-lg-grow-1">
                      <input type="email" id="email" class="form-control">
                    </div>
                  </div>
                </div>

                <div class="col-12 col-lg-6">
                  <div class="row">
                    <div class="col-auto">
                      <label for="birthDay" class="col-form-label">生日</label>
                    </div>
                    <div class="col-auto flex-lg-grow-1">
                      <input :readonly="!isEditing" type="date" id="birthDay" class="form-control" max="2024-03-15">
                    </div>
                  </div>
                </div>
                <div class="clo-12">
                  <p class="mb-2">地址</p>
                  <v-row>
                    <v-col cols="6" md="3">
                      <v-autocomplete :readonly="!isEditing" bg-color="white" label="縣市"
                        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']" variant="outlined"
                        hide-details></v-autocomplete>
                    </v-col>
                    <v-col cols="6" md="3">
                      <v-autocomplete :readonly="!isEditing" bg-color="white" label="鄉鎮市區"
                        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']" variant="outlined"
                        hide-details></v-autocomplete>
                    </v-col>
                    <v-col cols="6" md="3">
                      <v-text-field :readonly="!isEditing" bg-color="white" label="郵遞區號" variant="outlined"
                        hide-details></v-text-field>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
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
<style scoped lang="scss">
.levelRule {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  color: var(--firstColor);
  cursor: pointer;

  &:hover {
    filter: brightness(0.5);
  }
}
</style>