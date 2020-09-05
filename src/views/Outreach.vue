<template>
<div class="grey lighten-3 fill-height">
  <v-row align="center" class="fill-height">
    <v-col>
  <v-row justify="center" class="mb-8">
    <v-card min-width="35vmax" tile>
      <v-container>
        <v-row justify="space-around">
        <v-card-title>
          <v-btn x-large outlined color="primary">Upload Contact List</v-btn>
        </v-card-title>
        </v-row>
        <v-row justify="space-around" align="center">
        <v-card-subtitle> Upload Excel/Csv Contact list files </v-card-subtitle>
        </v-row>
      </v-container>
    </v-card>
  </v-row>
  <v-row justify="center">
  <div class="center-separator">
    OR
  </div>
  </v-row>
  <v-row class="mt-8" justify="center">
        <v-card :style="{minWidth: '70vmin'}" tile>
          <v-container fluid>
          <v-card-title > Single Contact </v-card-title>
          <v-card-subtitle> Add Candidates to be contacted </v-card-subtitle>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                v-model="candidate.name"
                label="Name"
                :rules="[v => !!v || 'Name is required']"
                required
              ></v-text-field>
              <v-text-field
                v-model="candidate.phone"
                label="Phone"
                :rules="phoneRules"
                maxlength="13"
                required
              ></v-text-field>

              <v-text-field
                v-model="candidate.email"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>
              <v-select
                v-model="candidate.jobId"
                :items="getPositions"
                label="Applying Position"
                multiple
              ></v-select>
              <v-card-actions>
              <v-btn
                large
                color="warning"
                class="mr-4"
                @click="reset"
              >
                Reset
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                large
                color="success"
                @click="addCandidate"
              >
                Submit
              </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
          </v-container>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="25vmax">
          <v-card>
            <v-card-title>Candidate Added</v-card-title>
            <v-card-actions>
              <v-btn color="yellow darken-4" text to="/">Chat</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-row>
    </v-col>
  </v-row>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Outreach',
  data: () => ({
    dialog: false,
    valid: true,
    candidate: {
      name: '',
      email: '',
      phone: '',
      jobId: '',
      avatar: '',
      currentPosition: '',
      currentCompany: '',
      currentLocation: ''
    },
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    phoneRules: [
      v => !!v || 'Phone is required',
      v => (v || '').length >= 10 || '10 characters required'
    ]
  }),
  computed: {
    ...mapState(['vacancies', 'recruiter']),
    getPositions () {
      const positions = this.vacancies.map(vacancy => { // this will add the location to the position title in the select menu
        return {
          text: vacancy.jobTitle + ' - ' + vacancy.location,
          value: vacancy._id
        }
      })
      return positions
    }

  },
  methods: {
    ...mapActions(['addCandidates', 'fetchData']),
    reset () {
      this.$refs.form.reset()
    },
    addCandidate () {
      if (this.$refs.form.validate()) {
        const candidate = {}
        Object.keys(this.candidate).forEach((prop) => {
          if (this.candidate[prop]) { candidate[prop] = this.candidate[prop] }
        })
        // this.addCandidate(candidate)
        this.addCandidates([candidate])
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
.center-separator {
    display: flex;
  line-height: 1em;
  color: gray;
}

.center-separator::before, .center-separator::after {
    content: '';
    display: inline-block;
    flex-grow: 1;
    margin-top: 0.5em;
    background: gray;
    height: 1px;
    margin-right: 10px;
    margin-left: 10px;
  }
</style>
