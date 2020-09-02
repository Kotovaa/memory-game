<template>
  <div class="dashboard">
    <div v-if="loading" class="spinner">
      <div>
        <img src="@/assets/spinner.gif" />
      </div>
      <span>Загрузка...</span>
    </div>

    <div v-else>
      <div class="statistics">
        <span>Ходы: {{ turns }}</span>
        <span>Пары: {{ pairsMatched }} из {{ pairs }}</span>
        <span>{{ gameTime }}</span>
        <button v-if="showResetButton" @click="resetGame">Новая игра</button>
      </div>

      <div class="cardWrapper">
        <Card v-for="card in deckCards" :key="card.number" :card="card" />
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Card from './Card.vue'
  import moment from 'moment'
  export default {
    props: {
      pairs: Number,
      time: Number
    },
    components: {
      Card
    },
    data: () => {
      return {
        deckCards: [],
        images: [],
        loading: true,
        openedCards: [],
        pairsMatched: 0,
        imgApiUrl: 'https://picsum.photos/200',
        turns: 0,
        startedGame: false,
        startTime: 0,
        timer: null,
        showResetButton: false,
        gameTime: "--:--",
        score: 0,
      }
    },
    mounted() {
      this.getImages()
      this.$on('onCardOpen', function(card) {
        this.openCard(card)
      });
    },
    watch: {
      images: function (val) {
        if (val.length === this.pairs) {
          this.generateCards()
          this.loading = false
        }
      }
    },
    methods: {
      cardsMatch: function(cards) {
        return cards[0].pair === cards[1].pair
      },
      closeCards: function() {
        this.deckCards.forEach((card) => {
          card.open = false
        })
      },
      getImages: async function() {
        while (this.images.length < this.pairs) {
          const response = await axios.get(this.imgApiUrl)
          if (response.request.responseURL) {
            this.images.push(response.request.responseURL)
          }
        }
      },
      generateCards: function() {
        let cards = []
        let numCard = 0
        this.images.forEach((image, index) => {
          for (let i = 0; i < 2; i++) {
            numCard += 1
            cards.push({
              number: numCard,
              pair: index,
              image: image,
              open: false,
              matched: false
            })
          }
        })
        this.deckCards = this.shuffleDeck(cards)
      },
      handlePossibleMatch: function(openedCards) {
        if (this.cardsMatch(openedCards)) {
          const openedCardNumbers = [openedCards[0].number, openedCards[1].number]
          this.deckCards.forEach((item, index) => {
            if (openedCardNumbers.includes(item.number)) {
              this.deckCards[index].open = false
              this.deckCards[index].matched = true
            }
          })
          this.pairsMatched += 1
          if (this.pairsMatched === this.pairs) {
            this.endGame()
          }
        } else {
          this.closeCards()
        }
        this.turns += 1
        this.openedCards = []
      },
      openCard: function(card) {
        if(!this.startedGame) {
          this.startGame();
        }
        if (this.openedCards.length === 2) {
          return
        }
        this.deckCards.forEach((item, index) => {
          if (item.number === card.number) {
            this.deckCards[index].open = true
            return
          }
        })
        this.openedCards.push(card)
        if (this.openedCards.length === 2) {
          setTimeout(() => {
            this.handlePossibleMatch(this.openedCards)
          }, this.time)
        }
      },
      shuffleDeck: function(cards) {
        return cards
                .map(a => [Math.random(), a])
                .sort((a, b) => a[0] - b[0])
                .map(a => a[1])
      },
      resetGame: function() {
        this.generateCards()
        this.turns = 0
        this.startTime = 0
        this.score = 0
        this.gameTime = '--:--'
        this.pairsMatched = 0
      },

      startGame: function () {
        this.startedGame = true;
        this.startTime = moment();

        this.timer = setInterval(() => {
          this.gameTime = moment(moment().diff(this.startTime)).format("mm:ss");
        }, 1000);
      },

      endGame: function () {
        this.startedGame = false
        clearInterval(this.timer);
        let score = 1000 - (moment().diff(this.startTime, 'seconds') - this.images.length * 5) * 3 - (this.turns - this.images.length) * 5;
        this.score = Math.max(score, 0);
        this.showResetButton = true
        alert(`Ваш счет ${this.score}`)
      }
    }
  }
</script>

<style>
  * {
    box-sizing: border-box;
  }
  .spinner {
    width: 100%;
    text-align: center;
    span {
      font-size: 24px;
    }
  }
  .statistics span {
    display: inline-block;
    font-size: 24px;
    margin: 25px;
  }
  .cardWrapper {
    max-width: 50%;
    margin: 0 auto;
  }
</style>