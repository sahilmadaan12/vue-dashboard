<template>
    <v-navigation-drawer class="themeNav" app mini-variant expand-on-hover permanent>
       <div class="logo-log"><img src="../assets/images/logo-white.svg" alt=""></div>
      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="page in pages"
          :key="page.title"
          link
          :to = page.link
        >
          <v-list-item-icon>
            <v-icon>{{ page.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ page.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-icon>
          <v-icon medium >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{recruiter}}
            </v-list-item-title>
          </v-list-item-content>
            <v-list-item-icon>
              <v-btn color="white" outlined small @click="logout">Logout</v-btn>
            </v-list-item-icon>
        </v-list-item>
      </template>
    </v-navigation-drawer>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      pages: [
        { title: 'Chats', icon: 'mdi-message-text', link: '/dashboard' },
        { title: 'Outreach', icon: 'mdi-contacts', link: '/outreach' },
        { title: 'Positions', icon: 'mdi-clipboard-list', link: '/positions' },
        { title: 'Candidates', icon: 'mdi-desktop-mac-dashboard', link: '/candidates' }
      ]
    }
  },
  computed: {
    ...mapState(['recruiter'])
  },
  methods: {
    ...mapActions(['setRecruiter']),
    logout () {
      this.setRecruiter(null)
      this.$router.push('/')
    }
  }
}
</script>
