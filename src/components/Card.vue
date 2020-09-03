<template>
    <div v-if="card.matched" class="card matched"></div>

    <div v-else class="card" @click="clickCard">
        <img v-if="card.flipp" :src="card.image" />
        <div v-else class="not-flipped">Нажми</div>
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
                if (!this.card.flipp && !this.card.matched) {
                    this.$parent.$emit('onCardFlipp', this.card)
                }
            }
        }
    }
</script>

<style lang="scss">
    .card {
        display: inline-block;
        margin: 10px;
        width: 100px;
        height: 100px;
        vertical-align: top;
        cursor: pointer;
        border-radius: 5px;
        &.matched {
             cursor: default;
        }
        .not-flipped {
            border: 3px solid black;
            height: 100%;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: center;
        }
        img {
            display: inline-block;
            width: 100%;
            height: 100%;
        }
    }
</style>