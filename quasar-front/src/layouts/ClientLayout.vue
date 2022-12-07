<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Data Security System
        </q-toolbar-title>

        <q-btn flat dense round icon="home" aria-label="HomePage" to="/">
          <q-tooltip>Home</q-tooltip>
        </q-btn>
        <q-btn flat dense round icon="account_circle" aria-label="Account" v-if="!isAuthenticated" to="/login">
          <q-tooltip>Account</q-tooltip>
        </q-btn>
        <q-btn flat dense round icon="admin_panel_settings" aria-label="Admin" v-if="isAuthenticated && getMe.is_admin"
          to="/admin">
          <q-tooltip>Admin</q-tooltip>
        </q-btn>
        <q-btn flat dense round color="white" stack icon="manage_accounts" aria-label="Account" v-if="isAuthenticated">
          {{ getMe.name }}
          <q-tooltip>Account</q-tooltip>
        </q-btn>

        <q-btn flat dense round icon="logout" aria-label="Log out" v-if="isAuthenticated" @click="logout">
          <q-tooltip>Logout</q-tooltip>
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item-label header>
          Options
        </q-item-label>

        <q-item clickable v-ripple to="/client/databases" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="table_view" />
          </q-item-section>
          <q-item-section>
            Databases
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/client/anonymization" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="hotel_class" />
          </q-item-section>
          <q-item-section>
            Anonymization
          </q-item-section>
        </q-item>

        <!-- <q-item clickable v-ripple to="/anonymization" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="hotel_class" />
          </q-item-section>
          <q-item-section>
            Anonymization
          </q-item-section>
        </q-item> -->

        <q-item clickable v-ripple to="/client/token" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="key" />
          </q-item-section>
          <q-item-section>
            Access Token
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <q-list>
        <q-item-label header>
          Conta
        </q-item-label>
        <q-item clickable v-ripple to="/login" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="login" />
          </q-item-section>
          <q-item-section>
            Logar
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/register" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="person_add" />
          </q-item-section>
          <q-item-section>
            Registrar
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

import { defineComponent, ref } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'MainLayout',

  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('auth', ['getMe'])
  },

  methods: {
    logout() {
      this.$store.dispatch('auth/signOut')
      this.$router.push('/login')
    }
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)

    return {
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
