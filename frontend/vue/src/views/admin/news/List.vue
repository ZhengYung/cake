<script setup>
import { ref, inject } from 'vue';
import parseLocalTime from '@/assets/parseLocalTime';
import { RouterLink } from 'vue-router';
const axios = inject('axios');
const list = ref([]);
axios.get('/story')
    .then(res => {
        list.value = res.data;
    })
    .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
const deleteItem = (Item) => {
    axios.delete('/story', {
        data: {
            Id: Item.Id
        }
    })
        .then(res => {
            list.value = list.value.filter(item => item !== Item);
        })
        .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
}
</script>


<template>
    <v-container :fluid="true">
        <v-row>
            <v-col cols="6">
                <h2>最新消息</h2>
            </v-col>
            <v-col cols="6" class="text-end">預計做breadcrumbs</v-col>
        </v-row>
        <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="6">
                <v-btn to="/admin/news/add" color="green-lighten-1" class="new-btn" text="新增"></v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="6">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">縮圖</th>
                            <th scope="col">標題</th>
                            <th scope="col">發佈日</th>
                            <!-- <th scope="col">狀態</th> -->
                            <th scope="col">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list" :key="item.Id">
                            <td scope="row">{{ item.Thumbnail}}</td>
                            <td scope="row">{{ item.Title }}</td>
                            <td scope="row">{{ item.DOA }}</td>
                            <!-- <td scope="row">{{ 狀態 }}</td> -->
                            <td scope="row">
                                <div class="d-flex column-gap-3">
                                    <v-hover v-slot="{ isHovering, props }">
                                        <RouterLink v-bind="props" v-ripple :to="`/admin/news/edit/${item.Id}`"
                                            :class="[{ 'text-green-darken-1': isHovering }, 'cursor-pointer', 'fa-solid', 'fa-pen']">
                                        </RouterLink>
                                    </v-hover>
                                    <v-hover v-slot="{ isHovering, props }">
                                        <i v-bind="props" v-ripple
                                            :class="[{ 'text-red-darken-1': isHovering }, 'cursor-pointer', 'fa-solid', 'fa-trash-can']"
                                            @click="deleteItem(item)"></i>
                                    </v-hover>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </v-col>
        </v-row>
    </v-container>
</template>
<style lang="scss">
.new-btn .v-btn__content {
    color: white;
}
</style>

<style scoped lang="scss">
* {
    transition: unset;
}
a{
    color:black;
}
</style>