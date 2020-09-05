<template>
    <div id="app">
  <v-app class="for-login" id="inspire">
    <v-app id="inspire">
      <v-main>
        <v-container
          class="fill-height"
          fluid
        >
        <div class="dash-logo"><img src="../assets/images/logo.svg" alt=""></div>
          <v-row>
            <v-col cols="4">
              <div class="logBox modified">
                <h2>Recruiter Login</h2>
                <h3>Login to your account</h3>
                <v-form ref="form" v-model="valid">
                    <v-text-field
                      label="User Name"
                      placeholder="Enter Your User Name"
                      append-icon="mdi-account-outline"
                      name="login"
                      type="text"
                      v-model="username"
                      :rules="[v => (v || '').length >= 2 || 'Atleast 2 characters required']"
                    ></v-text-field>
                    <v-text-field
                      id="password"
                      label="Password"
                      placeholder="Enter Your Password"
                      append-icon="mdi-eye-off-outline"
                      name="password"
                      type="password"
                      v-model="password"
                    ></v-text-field>
                  </v-form>
              </div>
              <div class="logBox-bottom">
              <v-row class="align-items-center">
                <v-col lg="6"><v-btn color="themeBtn" @click="login" :loading="loading">Login</v-btn></v-col>
                <v-col lg="6"><a href="">Forgot Password?</a></v-col>
              </v-row>
              <p>Don't have account, please <a href="">Sign Up</a></p>
            </div>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </v-app>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'login',
  data: () => ({
    valid: true,
    username: '',
    password: '',
    loading: false
  }),
  computed: { ...mapState(['recruiter']) },
  methods: {
    ...mapActions(['setRecruiter']),
    login () {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.setRecruiter(this.username)
        setTimeout(() => {
          this.loading = false
          this.$router.push('dashboard')
        }, 1000)
      }
    }
  },
  mounted () {
    if (this.recruiter) {
      this.$router.push('dashboard')
    }
  }
}
</script>
