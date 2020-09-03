<template>
    <section class="start">
        <form>
            <input type="text" v-model="pairs" placeholder="Введите количество пар">
            <input type="text" v-model="time" placeholder="Введите время показа (мс)">
        </form>
        <router-link class="start" :to="{ name: 'Dashboard', params: { pairs: +this.pairs, time: +this.time } }">Старт</router-link>
    </section>
</template>

<script>
    export default {
        name: "StartGame",
        data: () => {
            return {
                pairs: null,
                time: null
            }
        }
    }
</script>

<style lang="scss" scoped>
    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        input {
            width: 250px;
            height: 50px;
            border-radius: 5px;
            border: 1px solid #ccc;
            margin-bottom: 5px;
            padding-left: 15px;
        }
    }
    a.start {
        text-decoration: none;
        width: 150px;
        height: 30px;
        border: 1px solid #3CC8AE;
        display: block;
        text-align: center;
        font-size: 14px;
        line-height: 30px;
        margin: 0 auto;
    }
</style>