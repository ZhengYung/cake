<script setup>
import { ckeditor, ClassicEditor, editorData, editorConfig } from '@/plugins/ckeditor';
import Swal from 'sweetalert2';
import { ref, inject, onUnmounted } from 'vue';
import { useRoute,useRouter } from 'vue-router';

onUnmounted(() => {
    editorData.value = "";
});

const route = useRoute();
const router=useRouter();
const Id = route.params.Id;
const axios = inject('axios');

const form = ref(false);
const title = ref("");
const sequence = ref(null);

const rules = {
    required: value => !!value || '必填',
    min_three: value => value.length >= 3 || '至少3個字',
    max_tweenty: value => value.length <= 20 || '最多20字',
    email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || '無效 e-mail.'
    }
}
axios.get(`/story/${Id}`)
    .then(res => {
        const data=res.data[0];
        title.value = data.Title;
        sequence.value = data.Sequence;
        editorData.value = data.Content;
    })
    .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
const submitForm = () => {
    console.log('送出表單');
    const formData = {
        data: {
            Id,
            Title: title.value,
            Content: editorData.value,
            Sequence: sequence.value
        }
    }
    axios.put('/story', formData)
        .then(res => {
            console.log(res.data);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "修改成功",
                showConfirmButton: false,
                timer: 1500,
                didClose: () => { router.push('/admin/story') }
            })
        })
        .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
}
</script>
<template>
    <v-container :fluid="true">
        <v-form @submit.prevent="submitForm" v-model="form">
            <v-row>
                <v-col cols="2"></v-col>
                <v-col cols="1">
                    <v-text-field type="number" min="0" v-model:model-value="sequence" :rules="[rules.required]"
                        label="排序" hide-details="auto"></v-text-field>
                </v-col>
            </v-row>
            <v-row class="mt-0">
                <v-col cols="2"></v-col>
                <v-col cols="8">
                    <v-text-field v-model:model-value="title" counter maxlength="20"
                        :rules="[rules.required, rules.min_three]" label="標題" clearable
                        hide-details="auto"></v-text-field>
                </v-col>
            </v-row>
            <v-row class="mt-0">
                <v-col cols="2"></v-col>
                <v-col cols="8">
                    <ckeditor :editor="ClassicEditor" v-model="editorData" :config="editorConfig">
                    </ckeditor>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="2"></v-col>
                <v-col cols="8"><v-btn class="d-block ms-auto submitBtn" :disabled="!form"
                        type="submit">送出</v-btn></v-col>
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