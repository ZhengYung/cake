<script setup>
import { ref, inject, onMounted } from 'vue';
import parseLocalTime from '@/assets/parseLocalTime';
import Swal from 'sweetalert2';
const axios = inject('axios');
const list = ref([]);
const getList = () => {
    axios.get('/newsLayer')
        .then(res => {
            list.value = res.data;
        })
        .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
}
onMounted(() => {
    getList();
});
const newItem = () => {
    (async () => {
        const { value: Name } = await Swal.fire({
            title: "新增-最新消息類別",
            input: "text",
            inputLabel: "名稱",
            inputValue: "",
            showCancelButton: true,
            focusConfirm: false,
            didOpen() {
                const input = Swal.getInput();
                const confirmBtn = Swal.getConfirmButton();
                confirmBtn.disabled = true;
                input.addEventListener('input', (e) => {
                    if (e.target.value !== '') {
                        if (e.target.value.length >= 3) {
                            axios.get(`/newsLayer/${e.target.value}`)
                                .then(res => {
                                    if (!res.data.available) {
                                        Swal.showValidationMessage('此名稱已存在');
                                        confirmBtn.disabled = true;
                                    }
                                    else {
                                        confirmBtn.disabled = false;
                                    }
                                })
                                .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
                        }
                        else {
                            Swal.showValidationMessage('最少3個字');
                            confirmBtn.disabled = true;
                        }
                    }
                    else {
                        Swal.showValidationMessage('不能為空');
                        confirmBtn.disabled = true;
                    }
                });
            }
        });
        if (Name) {
            const formData = {
                data: {
                    Name
                }
            }
            axios.post("/newsLayer", formData)
                .then(res => {
                    console.log(res.data);
                    getList();
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "新增成功",
                        showConfirmButton: false,
                        timer: 1500,
                    })
                })
                .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
        }
    })()
};

const updateItem = (item) => {
    (async () => {
        const { value: Name } = await Swal.fire({
            title: "修改-最新消息類別",
            input: "text",
            inputLabel: "名稱",
            inputValue: `${item.Name}`,
            showCancelButton: true,
            focusConfirm: false,
            didOpen() {
                const input = Swal.getInput();
                const originValue = input.value;
                const confirmBtn = Swal.getConfirmButton();
                confirmBtn.disabled = true;
                input.addEventListener('input', (e) => {
                    if (e.target.value !== '') {
                        if (e.target.value.length >= 3) {
                            if (e.target.value === originValue) {
                                Swal.showValidationMessage('原始名稱');
                                confirmBtn.disabled = true;
                            }
                            else {
                                axios.get(`/newsLayer/${e.target.value}`)
                                    .then(res => {
                                        if (!res.data.available) {
                                            Swal.showValidationMessage('此名稱已存在');
                                            confirmBtn.disabled = true;
                                        }
                                        else {
                                            confirmBtn.disabled = false;
                                        }
                                    })
                                    .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
                            }
                        }
                        else {
                            Swal.showValidationMessage('最少3個字');
                            confirmBtn.disabled = true;
                        }
                    }
                    else {
                        Swal.showValidationMessage('不能為空');
                        confirmBtn.disabled = true;
                    }
                });
            }
        });
        if (Name) {
            const formData = {
                data: {
                    Name,
                    Id: item.Id
                }
            }
            axios.put("/newsLayer", formData)
                .then(res => {
                    console.log(res.data);
                    getList();
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `${item.Name}更改為${Name}`,
                        showConfirmButton: false,
                        timer: 1500,
                    })
                })
                .catch(err => console.log(`axios錯誤訊息:${err.response.data.message}`));
        }
    })()
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
            axios.delete('/newsLayer', {
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
        <v-row>
            <v-col cols="6">
                <h2>最新消息類別</h2>
            </v-col>
            <v-col cols="6" class="text-end">預計做breadcrumbs</v-col>
        </v-row>
        <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="6">
                <v-btn @click="newItem()" color="green-lighten-1" class="new-btn" text="新增"></v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="6">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">名稱</th>
                            <th scope="col">建立日期</th>
                            <th scope="col">修改日期</th>
                            <th scope="col">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list" :key="item.Id">
                            <td scope="row">{{ item.Name }}</td>
                            <td scope="row">{{ parseLocalTime('Taipei', item.Created_at) }}</td>
                            <td scope="row">{{ parseLocalTime('Taipei', item.Updated_at) }}</td>
                            <td scope="row">
                                <div class="d-flex column-gap-3">
                                    <v-hover v-slot="{ isHovering, props }">
                                        <i v-bind="props" v-ripple
                                            :class="[{ 'text-green-darken-1': isHovering }, 'cursor-pointer', 'fa-solid', 'fa-pen']"
                                            @click="updateItem(item)">
                                        </i>
                                    </v-hover>
                                    <v-hover v-slot="{ isHovering, props }">
                                        <i v-bind="props" v-ripple
                                            :class="[{ 'text-red-darken-1': isHovering }, 'cursor-pointer', 'fa-solid', 'fa-trash-can']"
                                            @click="deleteItem(item)">
                                        </i>
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

div:where(.swal2-icon).swal2-warning {
    border-color: #facea8;
    color: #f8bb86;
}
</style>