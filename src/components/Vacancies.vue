<template>
  <v-container class="pa-0">
    <h2 class="topTxt">Vacancies</h2>
    <div class="top-search">
      <v-text-field
        class=""
        dense
        clearable
        placeholder="Vacancies"
        append-icon="mdi-magnify"
        v-model=search
      ></v-text-field>
    </div>
    <perfect-scrollbar>
      <v-list class="pa-0">
        <v-list-item-group color="blue darken-4" mandatory>
          <v-list-item
            three-line
            v-for="vacancy in searchVacancy"
            :key="vacancy._id"
            @click="vacancySelected(vacancy._id)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="vacancy.jobTitle" class="body-2"></v-list-item-title>
              <v-list-item-subtitle>
                <span v-if="vacancy.minXp!==undefined">({{vacancy.minXp}}<span v-if="vacancy.maxXp"> - {{vacancy.maxXp}}</span>) Yrs.</span>
              </v-list-item-subtitle>
              <v-list-item-subtitle>
              </v-list-item-subtitle>
            <v-list-item-subtitle>
                <span v-if="vacancy.location">{{vacancy.location}}</span>
            </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
            <v-chip
              small
              label
              outlined
              color="primary"
            >
              {{vacancy.applicationReceived}}
            </v-chip>
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </perfect-scrollbar>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data: () => ({
    search: ''
  }),
  computed: {
    ...mapState(['vacancies']),
    searchVacancy () {
      return this.vacancies.filter(vacancy => {
        if (this.search === null) {
          return true
        } else {
          return vacancy.jobTitle.toUpperCase().match(this.search.toUpperCase())
        }
      })
    },
    height () {
      if (this.$vuetify.breakpoint.name === 'xl') {
        return '93vmin'
      }
      if (this.$vuetify.breakpoint.name === 'lg') {
        return '91vmin'
      }
      if (this.$vuetify.breakpoint.name === 'md') {
        return '25vmin'
      }
      if (this.$vuetify.breakpoint.name === 'sm') {
        return '13vmin'
      }
      return '35vmin'
    }
  },
  methods: {
    ...mapActions(['fetchData', 'setSelectedVacancy']),
    vacancySelected (jobid) {
      this.setSelectedVacancy(jobid)
    }
  },
  mounted () {
    // this.$store.dispatch('fetchVacancies')
    this.fetchData()
  }
}
</script>
