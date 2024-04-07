<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import VuePictureCropper, { cropper } from 'vue-picture-cropper';

const router = useRouter();
const route = useRoute();
const axios = inject('axios');
const Id = route.params.Id;

//品名清單
const products = ref([]);
const selectProductId = ref(null);
const getProducts = () => {
    axios.get('/product')
        .then(res => {
            products.value = res.data;
        })
        .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
}
onMounted(async () => {
    try {
        const res = await axios.get(`/productFlavor/${Id}`);
        const res2 = await axios.get('product');
        console.log(res);
        products.value = res2.data;
        selectProductId.value = res2.data.find(e => e.Id == res.data[0].ProductId).Id;
        productFlavor.value = res.data[0].Name;
        price.value = res.data[0].Price;
        selectPicture.value.forEach((item, index) => {
            item.imgURL = res.data[0][`Img${index + 1}`];
        });
    } catch (error) {
        console.log(error);
    }
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
const productFlavor = ref("");
const price = ref(null);

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

const pic = ref('');
const selectPicture = ref([
    {
        id: 'img1',
        imgURL: ''
    },
    {
        id: 'img2',
        imgURL: ''
    },
    {
        id: 'img3',
        imgURL: ''
    },
    {
        id: 'img4',
        imgURL: ''
    },
    {
        id: 'img5',
        imgURL: ''
    },
]);
const currentSelectPicture = ref('null');
// 將選擇的檔案傳給cropper
const selectFile = (e) => {
    pic.value = '';
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
        e.target.value = '';
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
            currentSelectPicture.value.imgURL = res.data.url;
        })
        .catch(err => console.log(`axios錯誤:${err.response.data.message}`));
    console.log({ base64, blob, file })

    dialog.value = false;
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
            ProductId: selectProductId.value,
            Name: productFlavor.value,
            Price: price.value,
            Img1: selectPicture.value[0].imgURL,
            Img2: selectPicture.value[1].imgURL,
            Img3: selectPicture.value[2].imgURL,
            Img4: selectPicture.value[3].imgURL,
            Img5: selectPicture.value[4].imgURL,
        }
    }

    axios.put('/productFlavor', formData)
        .then(res => {
            console.log(res.data);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "修改成功",
                showConfirmButton: false,
                timer: 1500,
                didClose: () => { router.push('/admin/product-flavor') }
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
            <v-row>
                <v-col cols="2"></v-col>
                <v-col cols="8">
                    <v-select v-model="selectProductId" label="品名" :items="products" item-title="Name" item-value="Id"
                        :rules="[rules.required]">
                    </v-select>
                    <v-text-field v-model:model-value="productFlavor" counter maxlength="20"
                        :rules="[rules.required, rules.min_three]" label="口味/規格" clearable>
                    </v-text-field>
                    <v-text-field type="number" min="0" v-model:model-value="price" :rules="[rules.required]" label="價格"
                        prepend-icon="fa-solid fa-minus" append-icon="fa-solid fa-plus"
                        @click:prepend="price = price == 0 ? 0 : price - 1" @click:append="price = price + 1">
                    </v-text-field>
                    <v-row>
                        <v-col cols="6" sm="4" md="" v-for="(item, index) in selectPicture" :key="item.id">
                            <div class="select-picture">
                                <p v-if="item.imgURL === ''">圖{{ index + 1 }}</p>
                                <img :src="item.imgURL" alt="">
                                <input class="fileSelector" type="file"
                                    accept="image/jpg, image/jpeg, image/png, image/gif"
                                    @click="currentSelectPicture = item" @change="selectFile">
                            </div>
                        </v-col>
                    </v-row>
                    <v-btn class="d-block ms-auto mt-3 submitBtn" type="submit"
                        :disabled="!form || selectPicture[0].imgURL == ''">送出</v-btn>
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
    width: 100%;
    aspect-ratio: 1;

    p {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

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