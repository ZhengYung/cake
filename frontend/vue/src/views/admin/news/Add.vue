<script setup>
import { ckeditor, ClassicEditor, editorData, editorConfig } from '@/plugins/ckeditor';
import { ref, inject, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const axios = inject('axios');
import Swal from 'sweetalert2';
import { toRaw } from 'vue';

onUnmounted(() => {
    editorData.value = "";
});
const dateVal = ref(null);
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

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const minDate = yesterday;


const dateDisp = computed(() => {
    if (dateVal.value) {
        const date = new Date(dateVal.value);
        showDatePicker.value = false;
        return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
    }
    return "";
})

const showDatePicker = ref(false);
const closeDatePicker = () => {
    showDatePicker.value = false;
}

const submitForm = () => {
    console.log('送出表單');
    const formData = {
        data: {
            Title: title.value,
            Content: editorData.value,
            Sequence: sequence.value
        }
    }
    console.log(editorData.value);
    axios.post('/story', formData)
        .then(res => {
            console.log(res.data);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "新增成功",
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
                <v-col cols="3"></v-col>
                <v-col cols="6">
                    <v-text-field v-model:model-value="title" counter maxlength="20"
                        :rules="[rules.required, rules.min_three]" label="標題" clearable
                        hide-details="auto"></v-text-field>
                    <ckeditor :editor="ClassicEditor" v-model="editorData" :config="editorConfig">
                    </ckeditor>
                    <v-btn class="d-block ms-auto mt-3 submitBtn" :disabled="!form" type="submit">送出</v-btn>
                </v-col>
                <v-col cols="3">
                    <v-text-field @click:control="showDatePicker = !showDatePicker" v-model:model-value="dateDisp"
                        label="發佈日" readonly :rules="[rules.required]" hide-details="auto"></v-text-field>
                    <div v-if="showDatePicker">
                        <v-date-picker :min="minDate" v-model:model-value="dateVal" width="100%" hide-header
                            v-click-outside="closeDatePicker"></v-date-picker>
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
</style>