import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        count: 0,
        orderIds:[],
    }),
    actions: {
        increment() {
            this.count++
        },
        randomizeCounter() {
            this.count = Math.round(100 * Math.random())
        },
    },
})

