<template>
  <v-col class="main-compo" cols="12" md="4" sm="6" xl="4" lg="3">
    <v-card elevation="2" class="pa-4">
      <p class="ma-0 f-size">Update Profile</p>
      <v-card-text class="center-card">
        <v-form ref="form" lazy-validation>
          <v-col class="pl-0 pr-0 pt-5">
            <v-text-field
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
              v-model="mobile_no"
              label="Mobile No"
              solo
              dense
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-row class="ma-0 pa-0 pt-3">
            <v-spacer></v-spacer>
            <v-btn
              @click="update()"
              :loading="btnLoadingUpdate"
              :disabled="btnDisable"
              class="green darken-3 ma-0 white--text"
              dark
              >Update</v-btn
            >
          </v-row>
          <br />
          <hr />

          <br />
          <v-row class="ma-0 pa-0">
            <v-spacer></v-spacer>
            <v-btn
              @click="resetPassword()"
              :loading="btnLoadingReset"
              :disabled="btnDisable"
              class="red darken-4 ma-0 white--text"
              dark
              >Reset Password</v-btn
            >
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="center-action">
        <v-btn
          class="low-case-btn red--text text--lighten-3"
          text
          :loading="btnLoadingDelete"
          :disabled="btnDisable"
          @click="deleteAccount"
          >Delete Account</v-btn
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
  name: "profile_screen",
  head: {
    title: "Profile",
  },
  data() {
    return {
      name: "",
      email: "",
      name: "",
      name_of_trustee: "",
      mobile_no: "",
      isPassShow: false,
      btnDisable: false,
      btnLoadingReset: false,
      btnLoadingUpdate: false,
      btnLoadingDelete: false,
    };
  },

  created() {
    this.$store.commit("systemUser/findUserData");
    studentsRef = this.$fire.firestore.collection("students");
  },
  computed: {
    userData() {
      return this.$store.getters["systemUser/userData"];
    },
  },
  watch: {
    userData(value) {
      this.name = value?.name;
      this.email = value?.email;
      this.name_of_trustee = value?.name_of_trustee;
      this.mobile_no = value?.mobile_no;
      // this.password = value?.password;
    },
  },
  methods: {
    async update() {
      try {
        if (this.name == null || this.name == "") {
          this.$store.dispatch("alertState/message", [
            "Please enter Name",
            "error",
          ]);
        } else if (this.name_of_trustee == null || this.name_of_trustee == "") {
          this.$store.dispatch("alertState/message", [
            "Please enter Name of Trustee",
            "error",
          ]);
        } else if (this.mobile_no == null || this.mobile_no == "") {
          this.$store.dispatch("alertState/message", [
            "Please enter Mobile Number",
            "error",
          ]);
        } else {
          this.btnLoadingUpdate = true;
          this.btnDisable = true;
          await this.$fire.auth.onAuthStateChanged(async (user) => {
            if (user) {
              studentsRef
                .doc(user.uid)
                .update({
                  name: this.name,
                  name_of_trustee: this.name_of_trustee,
                  mobile_no: this.mobile_no,
                })
                .then(async () => {
                  // Remove previos cookie
                  Cookies.remove("access_token_st");
                  // Create jwt token (Create a new with a new name)
                  let token = jwt.sign(
                    JSON.stringify({
                      student_id: this.userData.student_id,
                      name: this.name,
                      name_of_trustee: this.name_of_trustee,
                      mobile_no: this.mobile_no,
                      isAuth: true,
                      email: user.email,
                    }),
                    "systemuser_st"
                  );

                  // Token set to cookie (Reset)
                  // var in30Minutes = 1 / 48;
                  Cookies.set("access_token_st", token, {
                    expires: 1,
                  });
                })
                .then(() => {
                  this.$store.dispatch("alertState/message", [
                    "Profile updated successfully.",
                    "success",
                  ]);
                  this.$router.go();
                  this.btnLoadingUpdate = false;
                  this.btnDisable = false;
                })
                .catch((error) => {
                  this.$store.dispatch("alertState/message", [error, "error"]);
                  this.btnLoadingUpdate = false;
                  this.btnDisable = false;
                });
            }
          });
        }
      } catch (error) {
        console.log(error);
        this.btnLoadingReset = false;
        this.btnDisable = false;
      }
    },
    resetPassword() {
      try {
        if (this.$refs.form.validate()) {
          this.btnLoadingReset = true;
          this.btnDisable = true;
          this.$fire.auth
            .sendPasswordResetEmail(this.email)
            .then(() => {
              this.$store.dispatch("alertState/message", [
                "Reset Password link sent to your email address. Please check your inbox",
                "success",
              ]);
              this.btnLoadingReset = false;
              this.btnDisable = false;
            })
            .catch((error) => {
              this.$store.dispatch("alertState/message", [
                `"Reset Password error", ${error}`,
                "success",
              ]);
              this.btnLoadingReset = false;
              this.btnDisable = false;
            });
        }
      } catch (error) {
        console.log(error);
        this.btnLoadingReset = false;
        this.btnDisable = false;
      }
    },
    deleteAccount() {
      try {
        this.btnLoadingDelete = true;
        this.btnDisable = true;
        const user = this.$fire.auth.currentUser;
        studentsRef
          .doc(user.uid)
          .delete()
          .then(() => {
            Cookies.remove("access_token_st");
            this.$store.dispatch("alertState/message", [
              "Account deleted successfully",
              "success",
            ]);
            this.btnLoadingDelete = false;
            this.btnDisable = false;
            this.$router.go();
            // // TODO(you): prompt the user to re-provide their sign-in credentials
            // const credential = this.$fire.auth.promptForCredentials();

            // user
            //   .reauthenticateWithCredential(credential)
            //   .then(() => {
            //     user
            //       .delete()
            //       .then(() => {
            //         Cookies.remove("access_token_st");
            //         this.$store.dispatch("alertState/message", [
            //           "Account deleted successfully",
            //           "success",
            //         ]);
            //         this.btnLoadingDelete = false;
            //         this.btnDisable = false;
            //         this.$router.go();
            //       })
            //       .catch((error) => {
            //         this.$store.dispatch("alertState/message", [
            //           error,
            //           "error",
            //         ]);
            //         this.btnLoadingDelete = false;
            //         this.btnDisable = false;
            //       });
            // })
            // .catch((error) => {
            //   this.$store.dispatch("alertState/message", [error, "error"]);
            //   this.btnLoadingDelete = false;
            //   this.btnDisable = false;
            // });
          })
          .catch((error) => {
            this.$store.dispatch("alertState/message", [error, "error"]);
            this.btnLoadingDelete = false;
            this.btnDisable = false;
          });
      } catch (error) {
        this.btnLoadingDelete = false;
        this.btnDisable = false;
        console.log(error);
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
.f-size {
  font-size: 20px;
}
.low-case-btn {
  text-transform: none;
}
.center-action {
  justify-content: center;
}
</style>