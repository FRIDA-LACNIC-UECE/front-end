<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>


        <q-toolbar-title>
          <q-toolbar-title>
          Data Security System
        </q-toolbar-title>
        </q-toolbar-title>
        <q-btn flat dense round icon="home" aria-label="HomePage" to="/">
          <q-tooltip>Home</q-tooltip>
        </q-btn>
        <q-btn flat dense round icon="account_circle" aria-label="Account" v-if="!isAuthenticated" to="/login">
          <q-tooltip>Account</q-tooltip>
        </q-btn>
        <q-btn flat dense round icon="admin_panel_settings" aria-label="Admin" v-if="isAuthenticated && getMe.is_admin"
          to="/admin/users">
          <q-tooltip>Admin</q-tooltip>
        </q-btn>
        <q-btn flat dense round color="white" stack icon="manage_accounts" aria-label="Account" v-if="isAuthenticated"
          to="/client/databases">{{ getMe.name }}
          <q-tooltip>Account</q-tooltip>
        </q-btn>

        <q-btn flat dense round icon="logout" aria-label="Log out" v-if="isAuthenticated" @click="logout">
          <q-tooltip>Logout</q-tooltip>
        </q-btn>

      </q-toolbar>
    </q-header>



    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <q-list>
        <q-item-label header>
          Account
        </q-item-label>
        <q-item clickable v-ripple to="/login" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="login" />
          </q-item-section>
          <q-item-section>
            Login
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/register" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="person_add" />
          </q-item-section>
          <q-item-section>
            Register
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

import { defineComponent, ref } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'MainLayout',

  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('auth', ['getMe'])
  },

  components: {
    EssentialLink
  },

  methods: {
    logout() {
      this.$store.dispatch('auth/signOut')
      this.$router.push('/')
    }
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  }
})
</script>
