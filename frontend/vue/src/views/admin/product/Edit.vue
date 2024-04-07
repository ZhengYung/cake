<script setup>
import { ref, inject, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import VuePictureCropper, { cropper } from 'vue-picture-cropper';

const router = useRouter();
const route = useRoute();
const axios = inject('axios');
const Id = route.params.Id;

console.log(Id);
//類別清單
const layers = ref([]);
const selectLayerId = ref(null);

onMounted(async () => {
    try {
        const res = await axios.get(`/product/${Id}`);
        const res2 = await axios.get('productLayer');
        console.log(res);
        console.log(res2);
        layers.value = res2.data;
        selectLayerId.value = res2.data.find(e => e.Id == res.data[0].LayerId).Id;
        productName.value = res.data[0].Name;
        introduction.value = res.data[0].Introduction;
        img.value = res.data[0].Img;
        selectActive.value=res.data[0].Active;
    } catch (error) {
        console.log(error);
    }
});

const activeList=[
    {
        title:'上架',
        value:'Y'
    },
    {
        title:'下架',
        value:'N'
    },
    {
        title:'無庫存',
        value:'E'
    },
];
const selectActive=ref('');
const rules = {
    required: value => !!value || '必填',
    min_three: value => value.length >= 3 || '至少3個字',
    max_tweenty: value => value.length <= 20 || '最多20字',
    email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || '無效 e-mail.'
    }
}

const form = ref(false);
const productName = ref("");
const introduction = ref("");

//封面圖
const cropperStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f8f8',
    margin: 'auto',
}
const cropperOptions = {
    viewMode: 1,
    dragMode: 'move',
    aspectRatio: 1,
    cropBoxResizable: false,
}
const cropperPresetMode = {
    mode: 'fixedSize',
    width: 500,
    height: 500,
}

const dialog = ref(false);
const uploadInput = ref(null);
const pic = ref('');
const img = ref('');

// 將選擇的檔案傳給cropper
const selectFile = (e) => {
    pic.value = '';
    img.value = '';

    // 獲取選擇的檔案
    const { files } = e.target
    if (!files || !files.length) return

    // 將檔案轉換成 *dataURL* 傳送給 cropper component
    const file = files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
        //更新cropper `:img` 的source來顯示圖片以做裁切
        pic.value = String(reader.result)

        // 開啟dialog
        dialog.value = true

        //清空element input 選取的檔案
        if (!uploadInput.value) return
        uploadInput.value.value = ''
    }
}

// 獲取裁切好的結果  
const getResult = async () => {
    if (!cropper) return
    const base64 = cropper.getDataURL()
    const blob = await cropper.getBlob()
    const file = await cropper.getFile();
    if (!blob) return

    const formData = new FormData();
    formData.append('upload', file);
    axios.post('/image', formData)
        .then(res => {
            img.value = res.data.url;
        })
        .catch(err => console.log(`axios錯誤:${err.response.data.message}`));
    console.log({ base64, blob, file })

    dialog.value = false
}

//確認cropper有work
const ready = () => {
    console.log('Cropper is ready.')
}

//送出表單

const submitForm = () => {
    console.log('送出表單');
    const formData = {
        data: {
            Id,
            LayerId: selectLayerId.value,
            ProductName: productName.value,
            Introduction: introduction.value,
            Img: img.value,
            Active:selectActive.value
        },
    }

    axios.put('/product', formData)
        .then(res => {
            console.log(res.data);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "修改成功",
                showConfirmButton: false,
                timer: 1500,
                didClose: () => { router.push('/admin/product') }
            })
        })
        .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
}


</script>
<template>
    <v-container :fluid="true">
        <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="500">
            <v-card>
                <v-toolbar>
                    <v-btn icon="fa-solid fa-xmark" @click="dialog = false"></v-btn>
                    <v-toolbar-title>裁切</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn text="取消" variant="text" @click="dialog = false"></v-btn>
                        <v-btn text="確定" variant="text" @click="getResult"></v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <div>
                    <VuePictureCropper :boxStyle="cropperStyle" :img="pic" :options="cropperOptions" @ready="ready"
                        :presetMode="cropperPresetMode" />
                </div>
            </v-card>
        </v-dialog>
        <v-form @submit.prevent="submitForm" v-model="form">
            <v-row class="justify-content-end">
                <v-col cols="6">
                    <v-select v-model="selectActive" label="狀態" :items="activeList" item-title="title" item-value="value"
                        :rules="[rules.required]"></v-select>
                    <v-select v-model="selectLayerId" label="類別" :items="layers" item-title="Name" item-value="Id"
                        :rules="[rules.required]"></v-select>
                    <v-text-field v-model:model-value="productName" counter maxlength="20"
                        :rules="[rules.required, rules.min_three]" label="品名" clearable></v-text-field>
                    <v-text-field v-model:model-value="introduction" counter maxlength="20"
                        :rules="[rules.required, rules.min_three]" label="簡述" clearable></v-text-field>
                    <v-btn class="d-block ms-auto mt-3 submitBtn" type="submit"
                        :disabled="!form || img == ''">送出</v-btn>
                </v-col>
                <v-col cols="6" md="4">
                    <div class="select-picture">
                        <p v-if="img == ''">請選擇封面圖</p>
                        <img :src="img" alt="">
                        <input ref="uploadInput" class="fileSelector" type="file"
                            accept="image/jpg, image/jpeg, image/png, image/gif" @change="selectFile">
                    </div>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>
<style scoped lang="scss">
.select-picture {
    position: relative;
    border: blue dashed 1px;
    overflow: hidden;
    width: 200px;
    aspect-ratio: 1;

    //用來顯示選擇檔案的提示文字
    p {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    //隱藏input
    input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        font-size: 0;
        cursor: pointer;
        opacity: 0;
    }
}

:deep(.cropper-container.cropper-bg) {
    background-repeat: repeat !important;
}
</style>