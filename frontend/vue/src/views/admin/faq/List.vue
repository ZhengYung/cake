<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import parseLocalTime from '@/assets/parseLocalTime';
import Swal from 'sweetalert2';

const router = useRouter();
const axios = inject('axios');

const list = ref([]);
const layers = ref([]);
const selectLayerId = ref(null);
const faq = ref(null);
const dialog = ref(false);
onMounted(async () => {
    try {
        const res = await axios.get('/faq');
        const res2 = await axios.get('/faqLayer');

        list.value = res.data;
        layers.value = res2.data.map(item => { return { Id: item.Id, Name: item.Name } });
        layers.value.push({ Id: 0, Name: "全部" });
        selectLayerId.value = 0;

    } catch (error) {
        console.error('錯誤:', error);
    }
});
const selectedLayerList = computed(() => {
    return selectLayerId.value == 0 ? list.value : list.value.filter(item => item.LayerId == selectLayerId.value);
})

const getFAQ = (Item) => {
    const Id = Item.Id;

    axios.get(`faq/${Id}`)
        .then(res => {
            faq.value = res.data[0];
            dialog.value = true;
        })
        .catch(err => console.error('獲取失敗:', err.response.data.message));
}
const editFAQ = (Id) => {
    dialog.value = false;
    router.push(`/admin/faq/edit/${Id}`);
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
            axios.delete('/faq', {
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
                        <v-btn text="修改" variant="text" @click="editFAQ(faq.Id)"></v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <div v-html="faq.Content"></div>
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
                        <tr v-for="item in selectedLayerList" :key="item.Id">
                            <td scope="row">{{ item.Name }}</td>
                            <td scope="row">{{ item.Title }}</td>
                            <td scope="row">
                                <v-btn append-icon="fa-regular fa-eye" @click="getFAQ(item)">
                                    查看
                                </v-btn>
                            </td>
                            <td scope="row">{{ parseLocalTime('Taipei', item.Created_at) }}</td>
                            <td scope="row">{{ parseLocalTime('Taipei', item.Updated_at) }}</td>
                            <td scope="row">
                                <div class="d-flex column-gap-3">
                                    <v-hover v-slot="{ isHovering, props }">
                                        <RouterLink v-bind="props" v-ripple :to="`/admin/faq/edit/${item.Id}`"
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