<template>
    <div v-if="card.matched" class="card matched"></div>

    <div v-else class="card" @click="clickCard">
        <img v-if="card.open" :src="card.image" />
        <div v-else class="not-opened">?</div>
    </div>
</template>

<script>
    export default {
        props: {
            card: Object
        },
        data: () => {
            return {}
        },
        methods: {
            clickCard: function() {
                if (!this.card.open && !this.card.matched) {
                    this.$parent.$emit('onCardOpen', this.card)
                }
            }
        }
    }
</script>

<style lang="scss">
    .card {
        display: inline-block;
        margin: 25px;
        width: 100px;
        height: 100px;
        vertical-align: top;
        cursor: pointer;
        border-radius: 5px;
        &.matched {
             cursor: default;
        }
        .not-opened {
            border: 3px solid black;
            height: 100%;
            text-align: center;
            font-size: 32px;
            padding-top: 25px;
        }
        img {
            display: inline-block;
            width: 100%;
            height: 100%;
        }
    }
</style>