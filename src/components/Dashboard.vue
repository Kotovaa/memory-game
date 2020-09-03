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
      time: Number,
      firstShowTime: Number,
    },
    components: {
      Card
    },
    data: () => {
      return {
        deckCards: [],
        images: [],
        loading: true,
        flippedCards: [],
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
      this.$on('onCardFlipp', function(card) {
        this.flippCard(card)
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
          card.flipp = false
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
              flipp: true,
              matched: false
            })
          }
        })
        this.deckCards = this.shuffleDeck(cards)
        setTimeout(() => {
          cards.forEach(card => {
            card.flipp = false
          })
        }, this.firstShowTime)
      },
      handlePossibleMatch: function(flippedCards) {
        if (this.cardsMatch(flippedCards)) {
          const flippedCardNumbers = [flippedCards[0].number, flippedCards[1].number]
          this.deckCards.forEach((item, index) => {
            if (flippedCardNumbers.includes(item.number)) {
              this.deckCards[index].flipp = false
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
        this.flippedCards = []
      },
      flippCard: function(card) {
        if(!this.startedGame) {
          this.startGame();
        }
        if (this.flippedCards.length === 2) {
          return
        }
        this.deckCards.forEach((item, index) => {
          if (item.number === card.number) {
            this.deckCards[index].flipp = true
            return
          }
        })
        this.flippedCards.push(card)
        if (this.flippedCards.length === 2) {
          setTimeout(() => {
            this.handlePossibleMatch(this.flippedCards)
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
    max-width: 40%;
    margin: 0 auto;
  }
</style>