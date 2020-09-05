<template>
  <v-app>
    <Navbar v-if="recruiter"/>
    <v-main>
        <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar'
import { mapState } from 'vuex'
export default {
  name: 'App',
  components: {
    Navbar
  },
  computed: { ...mapState(['recruiter']) }
}
</script>

<style>
/* .theme--light.v-application{
  background-color:#e0e0e0 !important;
} */
</style>
