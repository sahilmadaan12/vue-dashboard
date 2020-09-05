<template>
  <v-container class="pa-0">
    <h2 class="topTxt">Message</h2>
    <v-list v-if="loading">
        <v-list-item>
          <v-list-item-content>
            <v-sheet>
              <v-skeleton-loader
                type="list-item-avatar"
                max-width="300"
              ></v-skeleton-loader>
            </v-sheet>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    <v-list class="pa-0" v-else>
      <div class="proStat">
      <v-list-item>
        <v-list-item-avatar>
          <v-avatar :color="(currentCandidate.score >= 75)?'green': (currentCandidate.score >= 50)?'blue': (currentCandidate.score >= 25)? 'yellow darken-4' : 'red'"
            v-if="currentCandidate.avatar === undefined">
            <span class="white--text">{{getInitials(currentCandidate.name)}}</span>
          </v-avatar>
          <v-img :src="currentCandidate.avatar" v-else></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <span class="curName">{{currentCandidate.name}}</span>
          <span class="curSt">Online</span>
        </v-list-item-content>
      </v-list-item>
      </div>
    </v-list>
    <div class="chatWindow" ref="chatlog">
      <perfect-scrollbar>
      <v-list v-if="loading">
        <v-list-item v-for="item in dummy" :key="item">
          <v-list-item-content>
            <v-sheet>
              <v-skeleton-loader
                type="paragraph"
                tile
                max-width="200"
                :class="(item%2 == 0)?'ml-auto': 'mr-auto'"
              ></v-skeleton-loader>
            </v-sheet>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-else>
          <v-list-item v-for="(item, index) in currentCandidate.chat" :key="index">
              <v-list-item-content>
                <v-row :justify="(item.sender==='user')?'start':'end'">
                  <v-card max-width="300" class="mx-3" dark :color="(item.sender==='bot')?'blue': (item.sender==='user')?'green':'orange'">
                    <div class="sender-img"><img src="../assets/images/logo.svg" alt=""></div>
                    <div class="sent-Time">8:00 PM</div>
                    <v-card-text class="white--text">
                      {{item.text}}
                    </v-card-text>
                  </v-card>
                </v-row>
              </v-list-item-content>
          </v-list-item>
      </v-list>
      </perfect-scrollbar>
    </div>
      <v-container class="py-0">
        <div class="typing-msg">
        <v-text-field
          v-model="message"
          append-outer-icon="mdi-send"
          clear-icon="mdi-close-circle"
          clearable
          placeholder="Type a message here..."
          type="text"
          :loading="sendLoading"
          @keyup.enter="sendChat"
          @click:append-outer="sendChat"
        >
          <template v-slot:prepend>
            <v-menu content-class="themeDrop"
              style="top: -12px"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                >
                  <v-icon v-text="curChannel.icon">mdi-facebook-messenger</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item
                  v-for="(channel, index) in channels"
                  :key="index"
                  @click="curChannel=channels[index]"
                >
                  <v-list-item-icon>
                    <v-icon v-text="channel.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ channel.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-text-field>
        </div>
      </v-container>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data: () => ({
    sendLoading: false,
    message: '',
    dummy: [1, 2, 3, 4, 5, 6, 7, 8],
    curChannel: { title: 'REST', icon: 'mdi-web' },
    channels: [
      { title: 'REST', icon: 'mdi-web' },
      { title: 'Whatsapp', icon: 'mdi-whatsapp' }
    ]
  }),
  computed: {
    ...mapState(['currentCandidate', 'loading']),
    height () {
      if (this.$vuetify.breakpoint.name === 'xl') {
        return '86vmin'
      }
      if (this.$vuetify.breakpoint.name === 'lg') {
        return '81vmin'
      }
      if (this.$vuetify.breakpoint.name === 'md') {
        return '38vmin'
      }
      if (this.$vuetify.breakpoint.name === 'sm') {
        return '28vmin'
      }
      return '45min'
    }
  },
  methods: {
    ...mapActions(['fetchNewChat', 'sendMessage']),
    scrollToEnd () {
      var chatlog = this.$refs.chatlog
      chatlog.scrollTop = chatlog.scrollHeight
    },
    sendChat () {
      if (this.message) {
        this.sendLoading = true
        this.sendMessage({
          body: this.message,
          type: this.curChannel.title.toLowerCase()
        })
        this.message = ''
        setInterval(() => {
          this.sendLoading = false
        }, 2000)
      }
    },
    getInitials (string) {
      const names = string.split(' ')
      let initials = names[0].substring(0, 1).toUpperCase()
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      return initials
    }
  },
  mounted () {
    this.scrollToEnd()
    setInterval(() => {
      this.fetchNewChat()
    }, 2000)
  },
  updated () {
    this.scrollToEnd()
  }
}
</script>
