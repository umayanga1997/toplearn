<template>
  <v-col class="main-compo" cols="12" md="4" sm="6" xl="4" lg="3">
    <v-card elevation="2" class="pa-4">
      <v-tabs v-model="tab" color="orange">
        <v-tab> Sign In </v-tab>
        <v-tab> Sign Up </v-tab>
      </v-tabs>

      <v-card-text class="center-card">
        <v-avatar size="76" class="ma-5 indigo darken-1"
          ><v-icon size="35">mdi-account</v-icon></v-avatar
        >
        <v-col class="pa-0 ma-0 pt-5">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            dense
            outlined
            required
          ></v-text-field>
        </v-col>
        <v-col class="pa-0 ma-0">
          <v-text-field
            v-model="password"
            :type="isPassShow ? 'text' : 'password'"
            label="Password"
            :append-icon="isPassShow ? 'mdi-eye' : 'mdi-form-textbox-password'"
            @click:append="isPassShow = !isPassShow"
            dense
            outlined
            required
          ></v-text-field>
        </v-col>
        <v-col class="pa-0 ma-0">
          <v-select
            dense
            v-model="selectedRole"
            :items="roles"
            hide-selected
            label="Role"
            outlined
            clearable
            required
          ></v-select>
        </v-col>
      </v-card-text>
      <v-card-actions class="pb-5">
        <v-spacer></v-spacer>
        <v-btn
          @click="tab == 0 ? signIn() : signUp()"
          :loading="btnLoading"
          :disabled="btnLoading"
          class="green darken-3 ma-0 pa-4 mr-5 white--text"
          dark
          >{{ tab == 0 ? "Sign In" : "Sign Up"
          }}<template v-slot:loader>
            <span class="custom-loader">
              <v-icon>mdi-cached</v-icon>
            </span>
          </template></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "signin_screen",
  layout: "auth",
  data() {
    return {
      tab: null,
      selectedRole: null,
      roles: ["Student", "Teacher"],
      email: null,
      password: null,
      isPassShow: false,
      btnLoading: false,
    };
  },
  methods: {
    signIn() {
      try {
        console.log("Sign In");
      } catch (error) {}
    },
    signUp() {
      try {
        console.log("Sign Up");
      } catch (error) {}
    },
  },
};
</script>

<style lang="scss">
.main-compo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  & .center-card {
    text-align: center;
  }
}
</style>