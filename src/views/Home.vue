<template>
<div class="dash-wrap">
  <v-row no-gutters class="fill-height">
    <v-snackbar
      v-model="snackbar"
      color="error"
      app
      left
      multi-line
      top
    >
    {{errorMsg}}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-col lg="2" md="3" class="divide for-vac" fill-height>
      <Vacancies/>
    </v-col>
    <v-col lg="3" md="3" class="divide for-candidates" fill-height>
      <Candidates/>
    </v-col>
    <v-col lg="5" class="divide for-chat" >
      <Chats/>
    </v-col>
    <v-col lg="2" class="for-profile">
      <CandidateProfile/>
    </v-col>
  </v-row>
</div>
</template>
<script>
// @ is an alias to /src
import Vacancies from '@/components/Vacancies.vue'
import Candidates from '@/components/Candidates.vue'
import Chats from '@/components/Chats.vue'
import CandidateProfile from '@/components/CandidateProfile.vue'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    Vacancies,
    Candidates,
    Chats,
    CandidateProfile
  },
  data: () => ({
    snackbar: false,
    errorMsg: ''
  }),
  computed: {
    ...mapState(['globalError', 'recruiter'])
  },
  watch: {
    globalError () {
      if (this.globalError) {
        this.errorMsg = this.globalError
        this.snackbar = true
      }
    }
  },
  created () {
    if (!this.recruiter) {
      this.$router.push('/')
    }
  }
}
</script>
<style>
.divide {
  border-right: 1px solid lightgray;
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: lightgray;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
