<template>
  <v-app>
    <v-main>
      <!-- Tool Bar -->
      <v-toolbar dark flat dense>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>TOPLEARN</v-toolbar-title>

        <v-spacer />

        <template v-slot:extension>
          <v-tabs v-model="tab" centered color="orange">
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <!-- Drawer -->
      <v-navigation-drawer v-model="drawer" absolute bottom temporary>
        <!-- <v-list nav dense>
          <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
          >
            <v-list-item>
              <v-list-item-title>Foo</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Bar</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Fizz</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Buzz</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list> -->
      </v-navigation-drawer>
      <!-- Tabs -->
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item"> </v-tab-item>
      </v-tabs-items>
      <!-- Body -->
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer absolute app>
      <span
        >&copy; {{ new Date().getFullYear() + " Powerd by Apec Lanka" }}</span
      >
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      tab: null,
      items: ["Videos", "Tests", "Online"],
      drawer: false,
    };
  },
};
</script>
