<script setup>
import { ckeditor, ClassicEditor, editorData, editorConfig } from '@/plugins/ckeditor';
</script>
<template>
    <v-container :fluid="true">
        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <!-- <button @click="console.log(editorData)">輸出ckEditor內容至console.log</button> -->

            </v-col>
            
        </v-row>
        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <ckeditor :editor="ClassicEditor" v-model="editorData" :config="editorConfig">
                </ckeditor>
            </v-col>            
        </v-row>

    </v-container>
</template>
<style scoped lang="scss">
:deep(.ck-editor__editable_inline:not(.ck-comment__input *)) {
    height: 500px;
    overflow-y: auto;
}
</style>