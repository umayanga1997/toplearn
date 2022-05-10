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
        <v-form ref="form" lazy-validation>
          <div v-if="tab == 1">
            <v-col class="pl-0 pr-0 pt-5">
              <v-text-field
                :rules="[rules.required]"
                v-model="name"
                label="Name"
                solo
                dense
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col class="pl-0 pr-0 pt-5">
              <v-text-field
                :rules="[rules.required]"
                v-model="name_of_trustee"
                label="Name of Trustee"
                solo
                dense
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col class="pl-0 pr-0 pt-5">
              <v-text-field
                :rules="[rules.required]"
                v-model="mobile_no"
                label="Mobile No"
                solo
                dense
                outlined
                required
              ></v-text-field>
            </v-col>
          </div>
          <v-col class="pl-0 pr-0 pt-5">
            <v-text-field
              v-model="email"
              :rules="[rules.required, rules.email]"
              label="E-mail"
              solo
              dense
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col class="pl-0 pr-0 mt-2">
            <v-text-field
              v-model="password"
              :rules="[rules.required, rules.mincounter, rules.maxcounter]"
              :type="isPassShow ? 'text' : 'password'"
              label="Password"
              :append-icon="
                isPassShow ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
              "
              @click:append="isPassShow = !isPassShow"
              dense
              solo
              outlined
              required
            ></v-text-field>
          </v-col>
        </v-form>
      </v-card-text>
      <v-card-actions class="pb-5 mt-3 pr-0">
        <v-spacer></v-spacer>
        <v-btn
          @click="tab == 0 ? signIn() : signUp()"
          :loading="btnLoading"
          :disabled="btnLoading"
          class="green darken-3 ma-0 pa-4 mr-5 white--text"
          dark
          >{{ tab == 0 ? "Sign In" : "Sign Up" }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

var studentsRef;

export default {
  name: "signin_screen",
  head: {
    title: "Users",
    // meta: [
    //   { charset: 'utf-8' },
    //   { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    //   {
    //     hid: 'description',
    //     name: 'description',
    //     content: 'my website description'
    //   }
    // ],
    // link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  // layout: "auth",
  data() {
    return {
      tab: null,
      selectedRole: null,
      // roles: ["Student", "Teacher"],
      email: "",
      password: "",
      name: "",
      name_of_trustee: "",
      mobile_no: "",
      isPassShow: false,
      btnLoading: false,
      rules: {
        required: (value) => !!value || "Required.",
        mincounter: (value) => value.length >= 6 || "Min 6 characters",
        maxcounter: (value) => value.length <= 15 || "Max 15 characters",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
    };
  },
  mounted() {
    this.$store.commit("systemUser/findUserData");
  },
  created() {
    studentsRef = this.$fire.firestore.collection("students");
  },
  methods: {
    signIn() {
      try {
        if (this.$refs.form.validate()) {
          this.btnLoading = true;
          this.$fire.auth
            .signInWithEmailAndPassword(this.email, this.password)
            .then((userCredential) => {
              // Signed in without cookies
              // onAuthStateChanged triggerin, but not route to home screen (Require cookies (System User Data))
              return userCredential.user?.uid ?? null;
            })
            .then((uid) => {
              if (uid != null) {
                studentsRef
                  .doc(uid)
                  .get()
                  .then(async (snapshots) => {
                    if (snapshots.data()["active"] == true) {
                      // Create jwt token
                      let token = jwt.sign(
                        JSON.stringify({
                          student_id: snapshots.data()["student_id"],
                          name: snapshots.data()["name"],
                          name_of_trustee: snapshots.data()["name_of_trustee"],
                          mobile_no: snapshots.data()["mobile_no"],
                          isAuth: true,
                          email: snapshots.data()["email"],
                          // medium: snapshots.data()["medium"],
                        }),
                        "systemuser_st"
                      );
                      // Token set to cookie
                      // var in30Minutes = 1 / 48;
                      Cookies.set("access_token_st", token, {
                        expires: 1,
                      });

                      this.$store.dispatch("alertState/message", [
                        "Sign in successfully.",
                        "success",
                      ]);
                      // Reload
                      this.$router.go();
                    } else {
                      await this.$fire.auth
                        .signOut()
                        .then(() => {
                          Cookies.remove("access_token_st");
                          this.$store.commit("alertMessage/message", [
                            "The system user data not exist. Please try again.",
                            "error",
                          ]);
                        })
                        .catch((error) => {
                          this.btnLoading = false;
                          this.$store.commit("AlertMessage/message", [
                            error,
                            "error",
                          ]);
                        });
                    }
                  })
                  .then(() => {
                    this.btnLoading = false;
                  })
                  .catch((error) => {
                    this.btnLoading = false;
                    this.$store.dispatch("alertState/message", [
                      error,
                      "error",
                    ]);
                  });
              } else {
                this.btnLoading = false;
                this.$store.dispatch("alertState/message", [
                  "The System user not registered. Please try again.",
                  "error",
                ]);
              }
            })
            .catch(async (error) => {
              this.btnLoading = false;
              this.$store.dispatch("alertState/message", [error, "error"]);
            });
        }
      } catch (error) {
        this.btnLoading = false;
        this.$store.dispatch("alertState/message", [error, "error"]);
      }
    },
    signUp() {
      try {
        if (this.$refs.form.validate()) {
          this.btnLoading = true;
          this.$fire.auth
            .createUserWithEmailAndPassword(this.email, this.password)
            .then((userCredential) => {
              // Signed in without cookies
              // onAuthStateChanged triggerin, but not route to home screen (Require cookies (System User Data))
              return userCredential.user?.uid ?? null;
            })
            .then((uid) => {
              if (uid != null) {
                studentsRef
                  .get()
                  .then((querySnapshot) => {
                    return querySnapshot?.docs.length + 1 ?? 0 + 1;
                  })
                  .then((value) => {
                    let student_id;
                    if (value.toString().length == 1) {
                      student_id = "S00" + value;
                    } else if (value.toString().length == 2) {
                      student_id = "S0" + value;
                    } else {
                      student_id = "S" + value;
                    }
                    // Set Data
                    studentsRef
                      .doc(uid)
                      .set({
                        auth_id: uid,
                        student_id: student_id,
                        name: this.name,
                        name_of_trustee: this.name_of_trustee,
                        mobile_no: this.mobile_no,
                        email: this.email,
                        password: this.password,
                        active: true,
                        reg_date: new Date(),
                      })
                      .then(() => {
                        // Create jwt token
                        let token = jwt.sign(
                          JSON.stringify({
                            student_id: student_id,
                            name: this.name,
                            name_of_trustee: this.name_of_trustee,
                            mobile_no: this.mobile_no,
                            email: this.email,
                            isAuth: true,
                          }),
                          "systemuser_st"
                        );
                        // Token set to cookie
                        // var in30Minutes = 1 / 48;
                        Cookies.set("access_token_st", token, {
                          expires: 1,
                        });

                        this.$store.dispatch("alertState/message", [
                          "Sign Up successfully.",
                          "success",
                        ]);
                        // Reload
                        this.$router.go();
                      });
                  });
              } else {
                this.btnLoading = false;
                this.$store.dispatch("alertState/message", [
                  "The System user not registered. Please try again.",
                  "error",
                ]);
              }
            })
            .catch(async (error) => {
              this.btnLoading = false;
              this.$store.dispatch("alertState/message", [error, "error"]);
            });
        }
      } catch (error) {
        this.btnLoading = false;
        this.$store.dispatch("alertState/message", [error, "error"]);
      }
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