<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
const router = useRouter();
const axios = inject('axios');
const list = ref([]);
const productNames = ref([]);
const selectProductId = ref(null);
const productFlavor = ref(null);
const dialog = ref(false);

onMounted(async () => {
    try {
        const res = await axios.get('/productFlavor');
        const res2 = await axios.get('/product');

        list.value = res.data;
        productNames.value = res2.data.map(item => { return { Id: item.Id, Name: item.Name } });
        productNames.value.push({ Id: 0, Name: "全部" });
        selectProductId.value = 0;

    } catch (error) {
        console.error('錯誤:', error);
    }
})
const selectedProductNameList = computed(() => {
    return selectProductId.value == 0 ? list.value : list.value.filter(item => item.ProductId == selectProductId.value);
})
const getProductFlavor = (Item) => {
    const Id = Item.Id;
    axios.get(`productFlavor/${Id}`)
        .then(res => {
            productFlavor.value = res.data[0];
            console.log(productFlavor.value)
            dialog.value = true;
        })
        .catch(err => console.error('獲取失敗:', err.response.data.message));
}
const editProductFlavor = (Id) => {
    dialog.value = false;
    router.push(`/admin/product-flavor/edit/${Id}`);
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
            axios.delete('/productFlavor', {
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
                        <v-btn text="修改" variant="text" @click="editProductFlavor(productFlavor.Id)"></v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-container fluid>
                    <v-row>
                        <v-col v-for="index in 5" :key="index" class="position-relative">
                            <img :src="productFlavor['Img' + index]" :alt="'圖' + index" v-if="productFlavor['Img' + index] !== ''">
                            <p class="h-100 d-flex justify-content-center align-items-center border" v-if="productFlavor['Img' + index] == ''">無圖{{ index }}</p>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-dialog>
        <v-row>
            <v-col cols="6">
                <h2>產品管理</h2>
            </v-col>
            <v-col cols="6" class="text-end">預計做breadcrumbs</v-col>
        </v-row>
        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <v-btn to="/admin/product-flavor/add" color="green-lighten-1" class="new-btn" text="新增"></v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">
                                <v-select :hide-details="true" variant="underlined" v-model="selectProductId" label="品名"
                                    :items="productNames" item-title="Name" item-value="Id"></v-select>
                            </th>
                            <th scope="col">口味/規格</th>
                            <th scope="col">價格</th>
                            <th scope="col">圖片</th>
                            <th scope="col">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in selectedProductNameList" :key="item.Id">
                            <td scope="row">{{ item.ProductName }}</td>
                            <td scope="row">{{ item.Name }}</td>
                            <td scope="row">{{ item.Price }}</td>
                            <td scope="row">
                                <v-btn append-icon="fa-regular fa-eye" @click="getProductFlavor(item)">
                                    查看
                                </v-btn>
                            </td>
                            <td scope="row">
                                <div class="d-flex column-gap-3">
                                    <v-hover v-slot="{ isHovering, props }">
                                        <RouterLink v-bind="props" v-ripple :to="`/admin/product-flavor/edit/${item.Id}`"
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