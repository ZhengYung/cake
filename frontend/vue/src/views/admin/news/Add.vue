<script setup>
import { ckeditor, ClassicEditor, editorData, editorConfig } from '@/plugins/ckeditor';
import { ref, inject, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import VuePictureCropper, { cropper } from 'vue-picture-cropper';

const router = useRouter();
const axios = inject('axios');

onUnmounted(() => {
    editorData.value = "";
});
//類別清單
const layers = ref([]);
const selectLayerId = ref(null);
const getLayers = () => {
    axios.get('/newsLayer')
        .then(res => {
            layers.value = res.data;
        })
        .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
}
onMounted(() => {
    getLayers();
});

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
const title = ref("");
const sub = ref("");

//datepicker
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const minDate = yesterday;

const menu = ref(false);
const dateVal = ref(null);

const dateDisp = computed(() => {
    if (dateVal.value) {
        const date = new Date(dateVal.value);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }
    return "";
})

//縮圖
const cropperStyle = {
    width: '200px',
    height: '200px',
    backgroundColor: '#f8f8f8',
    margin: 'auto',
}
const cropperOptions = {
    viewMode: 0,
    dragMode: 'move',
    aspectRatio: 1,
    cropBoxResizable: false,
}
const cropperPresetMode = {
    mode: 'fixedSize',
    width: 200,
    height: 200,
}

const dialog = ref(false);
const uploadInput = ref(null);
const pic = ref('');
const thumbnail = ref('');

// 將選擇的檔案傳給cropper
const selectFile = (e) => {
    pic.value = '';
    thumbnail.value = '';

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
            thumbnail.value = res.data.url;
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
            LayerId: selectLayerId.value,
            Title: title.value,
            Sub:sub.value,
            Content: editorData.value,
            Thumbnail: thumbnail.value,
            DOA: dateVal.value
        }
    }

    axios.post('/news', formData)
        .then(res => {
            console.log(res.data);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "新增成功",
                showConfirmButton: false,
                timer: 1500,
                didClose: () => { router.push('/admin/news') }
            })
        })
        .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
}


</script>
<template>
    <v-container :fluid="true">
        <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="400">
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
                    <v-select v-model="selectLayerId" label="類別" :items="layers" item-title="Name" item-value="Id"
                        :rules="[rules.required]"></v-select>
                    <v-text-field v-model:model-value="title" counter maxlength="20"
                        :rules="[rules.required, rules.min_three]" label="標題" clearable></v-text-field>
                    <v-text-field v-model:model-value="sub" counter maxlength="20"
                        :rules="[rules.required, rules.min_three]" label="副標題" clearable></v-text-field>
                    <ckeditor :editor="ClassicEditor" v-model="editorData" :config="editorConfig">
                    </ckeditor>
                    <v-btn class="d-block ms-auto mt-3 submitBtn" type="submit"
                        :disabled="!form || thumbnail == ''">送出</v-btn>
                </v-col>
                <v-col cols="6" md="4">
                    <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y>
                        <template #activator="{ props }">
                            <v-text-field v-model:model-value="dateDisp" v-bind="props" label="發佈日" readonly
                                :rules="[rules.required]"></v-text-field>
                        </template>

                        <v-date-picker v-model="dateVal" @update:model-value="menu = false" :min="minDate"
                            :hide-header="true" width="100%"></v-date-picker>
                    </v-menu>

                    <div class="select-picture">
                        <p v-if="thumbnail == ''">請選擇縮圖</p>
                        <img :src="thumbnail" alt="">
                        <input ref="uploadInput" class="fileSelector" type="file"
                            accept="image/jpg, image/jpeg, image/png, image/gif" @change="selectFile">
                    </div>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>
<style scoped lang="scss">
:deep(.ck-editor__editable_inline:not(.ck-comment__input *)) {
    height: 500px;
    overflow-y: auto;
}

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