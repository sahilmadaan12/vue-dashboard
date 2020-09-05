<template>
<div class="grey lighten-3 fill-height">
  <v-row class="fill-height">
    <v-col cols="12">
      <v-row align="center" justify="space-around" class="fill-height">
        <v-card width="40vmax" tile>
          <v-container fluid>
          <v-card-title > Roles </v-card-title>
          <v-card-subtitle> Add available roles </v-card-subtitle>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                v-model="position.jobTitle"
                label="Job Title"
                :rules="[v => !!v || 'Name is required']"
                required
              ></v-text-field>
              <v-text-field
                v-model="position.minXp"
                label="Minimum Experience"
                :rules="[v => !isNaN(v) || 'Invalid Input']"
                required
              ></v-text-field>
              <v-text-field
                v-model="position.maxXp"
                label="Maximum Experience"
                :rules="[v => !isNaN(v) || 'Invalid Input']"
              ></v-text-field>
              <v-text-field
                v-model="position.location"
                label="Job Location"
              ></v-text-field>
              <v-text-field
                v-model="position.salary"
                label="Salary"
              ></v-text-field>
              <v-textarea
                counter
                clearable
                auto-grow
                v-model="position.jobDesc"
                label="Job Description"
                required
              ></v-textarea>
              <v-card-actions>
              <v-btn
                color="warning"
                class="mr-4"
                @click="reset"
              >
                Reset
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="success"
                @click="postVacancy"
              >
                Submit
              </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
          </v-container>
        </v-card>
      <v-card width="40vmax" tile>
          <v-container fluid>
          <v-card-title > Screening Questions </v-card-title>
          <v-card-subtitle> Qualifiers applied in the roles </v-card-subtitle>
            <div :style="{maxHeight: '75vmin', overflow:'auto', scrollbarWidth: 'thin'}">
          <v-card-text>
              <v-card
                class="mx-auto divide ma-4"
                outlined
                v-for="(qualifier, index) in qualifiers"
                :key="index"
              >
                <v-chip
                  class="ma-2 text-overline divide"
                  outlined
                >
                  {{qualifier.type}}
                </v-chip>
                <v-btn class="float-right" icon>
                  <v-icon> mdi-dots-vertical</v-icon>
                </v-btn>
              <v-card-text class="text-body-2">
                {{qualifier.question}}
              </v-card-text>
              </v-card>
          </v-card-text>
            </div>
          </v-container>
        </v-card>
      </v-row>
    </v-col>
        <v-dialog v-model="dialog" persistent max-width="35vmax">
          <v-card>
            <v-card-title>Position Added</v-card-title>
            <v-card-actions>
              <v-btn color="yellow darken-4" text to="/outreach">Add Candidates</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-row>
</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'Outreach',
  data: () => ({
    dialog: false,
    valid: true,
    position: {
      jobTitle: '',
      maxXp: '',
      minXp: '',
      salary: '',
      jobDesc: '',
      location: ''
    },
    qualifiers: [
      {
        question: 'Do you have open availability for shifts, including weekends ?',
        type: 'Yes Or No'
      },
      {
        question: 'Which of the following language can you speak fluently ?',
        type: 'Multiple Choice'
      },
      {
        question: 'Are you comfortable Operating Computers ?',
        type: 'Yes Or No'
      },
      {
        question: 'How many years of supervisory work experience do you have ?',
        type: 'Integer Selection'
      },
      {
        question: 'How many years of Customer Service work experience do you have ?',
        type: 'Integer Selection'
      }
    ]
  }),
  computed: {
    ...mapGetters(['getVacancies']),
    ...mapState(['recruiter'])
  },
  methods: {
    ...mapActions(['addVacancy', 'fetchData']),
    reset () {
      this.$refs.form.reset()
    },
    postVacancy () {
      if (this.$refs.form.validate()) {
        const vacancy = {}
        Object.keys(this.position).forEach((prop) => { // this removes empty keys for which the data was not filled in the form
          if (this.position[prop]) { vacancy[prop] = this.position[prop] }
        })
        this.addVacancy(vacancy)
        this.reset()
        this.dialog = true
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  created () {
    if (!this.recruiter) {
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
.divide {
  border: 1px solid darkgrey;
}
</style>
