<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import Swal from 'sweetalert2';

const axios = inject('axios');
const list = ref([]);
const layers = ref([]);
const selectLayerId = ref(null);

onMounted(async () => {
    try {
        const res = await axios.get('/product');
        const res2 = await axios.get('/productLayer');

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
            axios.delete('/product', {
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
const state = (value) => {
    switch (value) {
        case 'Y':
            return { value: '上架', color: 'color:green' }
        case 'N':
            return { value: '下架', color: 'color:red' }
        case 'E':
            return { value: '無庫存', color: 'color:darkorange' }
    }
}
</script>

<template>
    <v-container :fluid="true">
        <v-row>
            <v-col cols="6">
                <h2>產品管理</h2>
            </v-col>
            <v-col cols="6" class="text-end">預計做breadcrumbs</v-col>
        </v-row>
        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <v-btn to="/admin/product/add" color="green-lighten-1" class="new-btn" text="新增"></v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">
                                <v-select :hide-details="true" variant="underlined" v-model="selectLayerId" label="類別"
                                    :items="layers" item-title="Name" item-value="Id"></v-select>
                            </th>
                            <th scope="col">狀態</th>
                            <th scope="col">封面圖</th>
                            <th scope="col">品名</th>
                            <th scope="col">描述</th>
                            <th scope="col">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in selectedLayerList" :key="item.Id">
                            <td scope="row">{{ item.LayerName }}</td>
                            <td scope="row" :style="state(item.Active).color" >{{ state(item.Active).value }}</td>
                            <td scope="row" style="width:200px;"><img :src="item.Img" alt="封面圖"></td>
                            <td scope="row">{{ item.Name }}</td>
                            <td scope="row">{{ item.Introduction }}</td>
                            <td scope="row">
                                <div class="d-flex column-gap-3">
                                    <v-hover v-slot="{ isHovering, props }">
                                        <RouterLink v-bind="props" v-ripple :to="`/admin/product/edit/${item.Id}`"
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