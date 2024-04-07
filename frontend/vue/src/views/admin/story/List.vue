<script setup>
import { ref, inject } from 'vue';
import parseLocalTime from '@/assets/parseLocalTime';
import { RouterLink } from 'vue-router';
import Swal from 'sweetalert2';
const axios = inject('axios');
const list = ref([]);
axios.get('/story')
    .then(res => {
        list.value = res.data;
    })
    .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));

const deleteItem = (Item) => {
    Swal.fire({
        title: `確定要刪除${Item.Title}?`,
        text: "此操作無法復原!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定!"
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete('/story', {
                data: {
                    Id: Item.Id
                }
            })
                .then(res => {
                    list.value = list.value.filter(item => item !== Item);
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `${Item.Title}刪除成功`,
                        showConfirmButton: false,
                        timer: 1500,
                    })
                })
                .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
        }
    });
}
</script>


<template>
    <v-container :fluid="true">
        <v-row>
            <v-col cols="6">
                <h2>品牌故事</h2>
            </v-col>
            <v-col cols="6" class="text-end">預計做breadcrumbs</v-col>
        </v-row>
        <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="6">
                <v-btn to="/admin/story/add" color="green-lighten-1" class="new-btn" text="新增"></v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="6">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">標題</th>
                            <th scope="col">建立日期</th>
                            <th scope="col">修改日期</th>
                            <th scope="col">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list" :key="item.Id">
                            <td scope="row">{{ item.Title }}</td>
                            <td scope="row">{{ parseLocalTime('Taipei', item.Created_at) }}</td>
                            <td scope="row">{{ parseLocalTime('Taipei', item.Updated_at) }}</td>
                            <td scope="row">
                                <div class="d-flex column-gap-3">
                                    <v-hover v-slot="{ isHovering, props }">
                                        <RouterLink v-bind="props" v-ripple :to="`/admin/story/edit/${item.Id}`"
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

a {
    color: black;
}
</style>