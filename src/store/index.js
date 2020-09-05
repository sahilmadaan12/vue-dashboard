import Vue from 'vue'
import Vuex from 'vuex'
// import tempFakeData from './tempFakeData'

Vue.use(Vuex)
const server = process.env.VUE_APP_REST_SERVER
const candidateUrl = server + 'candidates/'
const vacancyUrl = server + 'vacancies/'
const chatUrl = server + 'conversation/'

export default new Vuex.Store({
  state: {
    vacancies: [],
    candidates: [],
    selectedVacancyId: false, // The currently selected vacancy jobid
    currentCandidate: { _id: null, name: '', score: '', active: '', jobId: '', notes: '', chat: [] },
    globalError: '',
    loading: false,
    recruiter: null
  },
  getters: {
    getCurrentChat: state => state.currentCandidate.chat,
    getCandidates: state => {
      if (state.selectedVacancyId === 'unassigned') {
        return state.candidates.filter((candidate) => {
          if (candidate.jobId.length === 0) {
            return true
          }
        })
      } else {
        return state.candidates.filter((candidate) => {
          if (candidate.jobId.includes(state.selectedVacancyId)) {
            return true
          }
        })
      }
    },
    findFirstCandidate: state => {
      if (state.selectedVacancyId === 'unassigned') {
        return state.candidates.find(candidate => candidate.jobId.length === 0) //  unassigned candidates will have empty array of jobId
      } else {
        return state.candidates.find(candidate => candidate.jobId.includes(state.selectedVacancyId))
      }
    }
  },
  mutations: {
    setVacancies: (state, payload) => {
      state.vacancies = payload
    },
    setCandidates: (state, payload) => {
      state.candidates = payload
    },
    setSelectedVacancy: (state, payload) => {
      state.selectedVacancyId = payload
    },
    setCurrentCandidate: (state, payload) => {
      state.currentCandidate = {}
      state.currentCandidate = Object.assign({}, state.currentCandidate, { id: null, name: '', score: '', active: '', jobId: '', notes: '', chat: [] })
      if (payload.id) {
        const candidate = state.candidates.find(candidate => candidate._id === payload.id)
        if (payload.chat.length) {
          candidate.chat = payload.chat
        } else {
          candidate.chat = []
        }
        state.currentCandidate = Object.assign({}, state.currentCandidate, candidate)
      }
    },
    updateChat: (state, chat) => {
      if (state.currentCandidate.chat.length < chat.length) {
        state.currentCandidate.chat = chat
      }
    },
    sentMessage: (state, message) => {
      const chat = {
        sender: 'recruiter',
        text: message
      }
      state.currentCandidate.chat.push(chat)
    },
    addCandidates: (state, payload) => {
      payload.forEach(candidate => {
        state.candidates.push(candidate)
      })
    },
    addVacancy: (state, payload) => {
      state.vacancies.push(payload)
    },
    addNotes: (state, payload) => {
      state.candidates.forEach(candidate => {
        if (candidate._id === payload._id) {
          candidate.notes = payload.notes
        }
      })
      state.currentCandidate.notes = payload.notes
    },
    setglobalError: (state, payload) => {
      state.globalError = payload
    },
    toggleLoading: (state) => {
      state.loading = !state.loading
    },
    setRecruiter: (state, recruiter) => {
      state.recruiter = recruiter
    }
  },
  actions: {
    fetchData: async context => {
      await fetch(vacancyUrl).then(res => res.json()).then(data => {
        context.commit('setVacancies', data)
        context.commit('setSelectedVacancy', data[0]._id)
      }).catch(err => {
        console.log(err)
        context.commit('setglobalError', 'Failed to connect to the server !')
      })
      await fetch(candidateUrl).then(res => res.json()).then(data => {
        context.commit('setCandidates', data)
        context.dispatch('setCurrentCandidate', context.getters.findFirstCandidate._id)
        const unassigned = {
          _id: 'unassigned',
          jobTitle: 'Unassigned',
          applicationReceived: context.state.candidates.filter((candidate) => {
            if (candidate.jobId.length === 0) {
              return true
            }
          }).length
        }
        context.commit('addVacancy', unassigned)
      }).catch(err => {
        console.log(err)
        context.commit('setglobalError', 'Failed to connect to the server !')
      })
    },
    setSelectedVacancy: (context, jobid) => {
      context.commit('setSelectedVacancy', jobid)
      const firstCandidate = context.getters.findFirstCandidate
      context.dispatch('setCurrentCandidate', (firstCandidate) ? firstCandidate._id : null)
    },
    setCurrentCandidate: async (context, id) => {
      if (id) {
        context.commit('toggleLoading')
        await fetch(`${chatUrl}${id}`)
          .then(res => res.json()).then(chat => {
            context.commit('setCurrentCandidate', { id, chat })
            context.commit('toggleLoading')
          }).catch(err => { console.log(err) })
      } else {
        const chat = []
        context.commit('setCurrentCandidate', { id, chat })
      }
    },
    fetchNewChat: async context => {
      await fetch(`${chatUrl}${context.state.currentCandidate._id}`).then(res => res.json()).then(chat => {
        if (chat) {
          context.commit('updateChat', chat)
        }
      }).catch(err => { console.log(err) })
    },
    sendMessage: async (context, message) => {
      const msg = {
        text: message.body,
        to: message.type + ':' + context.state.currentCandidate.phone,
        channel: message.type,
        uid: context.state.currentCandidate.uid,
        sender: 'recruiter'
      }
      await fetch(`${chatUrl}${context.state.currentCandidate._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(msg)
      }).then(res => res.json()).then(response => {
        context.commit('sentMessage', response.text)
      }).catch(err => {
        context.commit('sentMessage', 'Error Occured, Please try again')
        console.log(err)
      })
    },
    addCandidates: async (context, candidates) => {
      await fetch(candidateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidates[0])
      }).then(res => res.json()).then(data => {
        context.commit('addCandidates', [data.createdCandidate])
      }).catch(err => console.log(err))
    },
    addVacancy: async (context, vacancy) => {
      await fetch(vacancyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vacancy)
      }).then(res => res.json()).then(data => {
        context.commit('addVacancy', data.createdVacancy)
      }).catch(err => console.log(err))
    },
    addNotes: async (context, notes) => {
      await fetch(candidateUrl + notes.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes: notes.text })
      }).then(res => res.json()).then(data => {
        context.commit('addNotes', data.updatedCandidate)
      }).catch(err => console.log(err))
    },
    setRecruiter: (context, recruiter) => {
      context.commit('setRecruiter', recruiter)
    }
  },
  modules: {
  }
})
