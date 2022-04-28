<template>
  <v-app>
    <v-main>
      <!-- Tool Bar -->
      <v-app-bar dark dense fixed app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>TOP-LEARN</v-toolbar-title>

        <v-spacer />
        <v-btn icon @click="filterDialog = !filterDialog">
          <v-icon>mdi-filter</v-icon>
        </v-btn>

        <template v-slot:extension>
          <v-tabs v-model="tab" centered color="orange">
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      <!-- Drawer -->
      <v-navigation-drawer v-model="drawer" fixed bottom temporary>
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
      <!-- Default Page Like Home Page -->
      <v-tabs-items v-model="tab">
        <v-tab-item class="tab_container" v-for="item in items" :key="item">
          <v-container fluid>
            <v-card class="mx-auto" max-width="344">
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                height="200px"
              ></v-img>

              <v-card-title> Top western road trips </v-card-title>

              <v-card-subtitle> 1,000 miles of wonder </v-card-subtitle>

              <v-card-actions>
                <v-btn color="orange lighten-2" text> Explore </v-btn>

                <v-spacer></v-spacer>

                <v-btn icon @click="show = !show">
                  <v-icon>{{
                    show ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>

                  <v-card-text>
                    I'm a thing. But, like most politicians, he promised more
                    than he could deliver. You won't have time for sleeping,
                    soldier, not with all the bed making you'll be doing. Then
                    we'll go with that data file! Hey, you add a one and two
                    zeros to that or we walk! You're going to do his laundry?
                    I've got to find a way to escape.
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
      <!-- Body -->
      <!-- <v-container fluid>
        <Nuxt />
      </v-container> -->
    </v-main>
    <v-footer absolute app>
      <span
        >&copy; {{ new Date().getFullYear() + " Powered by Apec Lanka" }}</span
      >
    </v-footer>
    <v-dialog v-model="filterDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Filter</span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-5">
            <v-col>
              <v-select :items="items" label="Grade" dense outlined></v-select>
            </v-col>
            <v-col>
              <v-select
                :items="items"
                label="Subject"
                dense
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red lighten-1" text @click="filterDialog = false">
            Close
          </v-btn>
          <v-btn color="green darken-2" @click="filterDialog = false">
            Filter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      show: false,
      filterDialog: false,
    };
  },
};
</script>

<style lang="scss">
.tab_container {
  background-color: #121212 !important;
}
</style>
