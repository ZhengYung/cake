<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import parseLocalTime from '@/assets/parseLocalTime';
import Swal from 'sweetalert2';

const router = useRouter();
const axios = inject('axios');

const list = ref([]);
const selectLayerId = ref(null);
const layers = ref(null);
const dialog = ref(false);
const faq = ref(null);
onMounted(async () => {
    try {
        const res = axios('faq');
        const res2 = axios('faqLayer');

        list.value = res.data;
        layers.value = res2.data.map(item => { return { Id: item.Id, Name: item.Name } });
        layers.value.push({ Id: 0, Name: "全部" });
        selectLayerId.value = 0;
    } catch (error) {
        console.error('錯誤:', error);
    }

});
</script>
<template>
    <v-container :fluid="true">
        <v-dialog v-model="dialog" transition="dialog-bottom-transition" scrollable>
            <v-card>
                <v-toolbar>
                    <v-btn icon="fa-solid fa-xmark" @click="dialog = false"></v-btn>
                    <v-toolbar-title>內容</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn text="確定" variant="text" @click="dialog = false"></v-btn>
                        <v-btn text="修改" variant="text" @click="editNews(news.Id)"></v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <div v-html="news.Content"></div>
            </v-card>
        </v-dialog>
        <v-row>
            <v-col cols="6">
                <h2>購物須知</h2>
            </v-col>
            <v-col cols="6" class="text-end">預計做breadcrumbs</v-col>
        </v-row>
        <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="6">
                <v-btn to="/admin/faq/add" color="green-lighten-1" class="new-btn" text="新增"></v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="6">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">
                                <v-select :hide-details="true" variant="underlined" v-model="selectLayerId" label="類別"
                                    :items="layers" item-title="Name" item-value="Id"></v-select>
                            </th>
                            <th scope="col">標題</th>
                            <th scope="col">內容</th>
                            <th scope="col">建立日期</th>
                            <th scope="col">修改日期</th>
                            <th scope="col">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list" :key="item.Id">
                            <td scope="row">{{ item.Name }}</td>
                            <td scope="row">{{ item.Title }}</td>
                            <td scope="row">
                                <v-btn append-icon="fa-regular fa-eye" @click="getNews(item)">
                                    查看
                                </v-btn>
                            </td>
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