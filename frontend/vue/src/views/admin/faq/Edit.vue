<script setup>
import { ckeditor, ClassicEditor, editorData, editorConfig } from '@/plugins/ckeditor';
import { ref, inject, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';


const router = useRouter();
const route=useRoute();
const axios = inject('axios');
const Id = route.params.Id;

const layers = ref([]);
const selectLayerId = ref(null);
const title = ref("");
const sequence = ref(null);

const form = ref(false);

const submitForm = () => {
    const formData = {
        data: {
            Id,
            LayerId: selectLayerId.value,
            Sequence: sequence.value,
            Title: title.value,
            Content: editorData.value,
        }
    }
    axios.put('/faq', formData)
        .then(res => {
            console.log(res.data);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "修改成功",
                showConfirmButton: false,
                timer: 1500,
                didClose: () => { router.push('/admin/faq') }
            })
        })
        .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
}

const rules = {
    required: value => !!value || '必填',
    min_three: value => value.length >= 3 || '至少3個字',
    max_tweenty: value => value.length <= 20 || '最多20字',
    email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || '無效 e-mail.'
    }
}

onMounted(async () => {
    try {
        const res = await axios.get(`/faq/${Id}`);
        const res2 = await axios.get('faqLayer');

        layers.value = res2.data;
        selectLayerId.value = res2.data.find(e => e.Id == res.data[0].LayerId).Id;
        sequence.value=res.data[0].Sequence;
        title.value = res.data[0].Title;
        editorData.value = res.data[0].Content;
    } catch (error) {
        console.log(error);
    }
});

onUnmounted(() => {
    editorData.value = "";
});




</script>
<template>
    <v-container :fluid="true">
        <v-form @submit.prevent="submitForm" v-model="form">
            <v-row>
                <v-col cols="2"></v-col>
                <v-col cols="2">
                    <v-text-field type="number" min="0" v-model:model-value="sequence" :rules="[rules.required]"
                        label="排序" prepend-icon="fa-solid fa-minus" append-icon="fa-solid fa-plus"
                        @click:prepend="sequence = sequence == 0 ? 0 : sequence - 1"
                        @click:append="sequence = sequence + 1">
                    </v-text-field>
                    <v-select v-model="selectLayerId" label="類別" :items="layers" item-title="Name" item-value="Id"
                        :rules="[rules.required]"></v-select>
                </v-col>
            </v-row>
            <v-row class="mt-0">
                <v-col cols="2"></v-col>
                <v-col cols="8">

                    <v-text-field v-model:model-value="title" counter maxlength="20"
                        :rules="[rules.required, rules.min_three]" label="標題" clearable></v-text-field>
                    <ckeditor :editor="ClassicEditor" v-model="editorData" :config="editorConfig">
                    </ckeditor>
                    <v-btn class="d-block ms-auto mt-3 submitBtn" type="submit" :disabled="!form">送出</v-btn>
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
</style>