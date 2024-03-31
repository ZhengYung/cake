<script setup>
import { ref, inject, onMounted } from 'vue';
import parseLocalTime from '@/assets/parseLocalTime';
import { RouterLink, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { computed } from 'vue';
const router = useRouter();
const axios = inject('axios');
const list = ref([]);
const layers = ref([]);
const selectLayerId = ref(null);
const news = ref(null);
const dialog = ref(false);

onMounted(async () => {
    try {
        const res = await axios.get('/news');
        const res2 = await axios.get('/newsLayer');

        list.value = res.data;
        layers.value = res2.data.map(item => { return { Id: item.Id, Name: item.Name } });
        layers.value.push({ Id: 0, Name: "全部" });
        selectLayerId.value = 0;

    } catch (error) {
        console.error('錯誤:', error);
    }
})
const selectedLayerList = computed(() => {
    return selectLayerId.value == 0 ? list.value : list.value.filter(item => item.LayerId == selectLayerId.value);
})
const getNews = (Item) => {
    const Id = Item.Id;
    console.log('test');
    axios.get(`news/${Id}`)
        .then(res => {
            news.value = res.data[0];
            dialog.value = true;
        })
        .catch(err => console.error('獲取失敗:', err.response.data.message));
}
const editNews = (Id) => {
    dialog.value = false;
    router.push(`/admin/news/edit/${Id}`);
}
const deleteItem = (Item) => {
    Swal.fire({
        title: `確定要刪除${Item.Name}?`,
        text: "此操作無法復原!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定!"
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete('/news', {
                data: {
                    Id: Item.Id
                }
            })
                .then(res => {
                    list.value = list.value.filter(item => item !== Item);
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `${Item.Name}刪除成功`,
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
                <h2>最新消息</h2>
            </v-col>
            <v-col cols="6" class="text-end">預計做breadcrumbs</v-col>
        </v-row>
        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <v-btn to="/admin/news/add" color="green-lighten-1" class="new-btn" text="新增"></v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">縮圖</th>
                            <th scope="col">
                                <v-select :hide-details="true" variant="underlined" v-model="selectLayerId" label="類別" :items="layers"
                                    item-title="Name" item-value="Id"></v-select>
                            </th>
                            <th scope="col">標題</th>
                            <th scope="col">副標題</th>
                            <th scope="col">內容</th>
                            <th scope="col">發佈日</th>
                            <th scope="col">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in selectedLayerList" :key="item.Id">
                            <td scope="row"><img :src="item.Thumbnail" alt="縮圖"></td>
                            <td scope="row">{{ item.LayerName }}</td>
                            <td scope="row">{{ item.Title }}</td>
                            <td scope="row">{{ item.Sub }}</td>
                            <td scope="row">
                                <v-btn append-icon="fa-regular fa-eye" @click="getNews(item)">
                                    查看
                                </v-btn>
                            </td>
                            <td scope="row">{{ parseLocalTime('Taipei', item.DOA) }}</td>
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

a {
    color: black;
}
</style>