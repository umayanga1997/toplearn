<template >
  <v-col cols="12" md="6" lg="5" sm="6" xl="5" class="ma-0 pa-2">
    <v-card>
      <v-card-title class="yellow--text">
        <span class="blue--text text--lighten-2 pr-2"
          >{{ item.index_no }})
        </span>
        {{ item.question }}
      </v-card-title>

      <!-- <v-card-subtitle>
        {{
          item.question_type == "Upload Answer"
            ? "Upload answer required"
            : stringToList(item.answers)
        }}
      </v-card-subtitle> -->

      <v-radio-group
        v-if="item.question_type == 'Single Answer'"
        v-model="selected_answer_s"
        column
        class="height-of-radio pa-4 ma-0 pb-0"
      >
        <v-radio
          :disabled="isCurrectAnswer != null ? true : false"
          v-for="item in stringToList(item.answers)"
          :key="item"
          :label="item"
          :value="item"
          class="mt-1"
        ></v-radio>
      </v-radio-group>
      <div
        v-else-if="item.question_type == 'Multiple Answer'"
        class="height-of-radio pa-4 ma-0 pb-0"
      >
        <v-checkbox
          :disabled="isCurrectAnswer != null ? true : false"
          v-model="selected_answer_s"
          v-for="item in stringToList(item.answers)"
          :key="item"
          :label="item"
          :value="item"
          class="ma-0"
        ></v-checkbox>
      </div>
      <div class="height-of-radio pa-4 ma-0 pb-0" v-else>Upload</div>

      <div class="pa-4" align="end" v-if="isCurrectAnswer != null">
        <v-icon
          size="35"
          v-if="isCurrectAnswer"
          class="green--text text--lighten-1"
          >mdi-check</v-icon
        >
        <v-icon size="35" v-else class="red--text text--lighten-1"
          >mdi-close</v-icon
        >

        <p align="start" v-if="!isCurrectAnswer">
          * Currect Answer(s) : {{ item.currect_answers }}
        </p>
      </div>

      <v-card-actions v-if="isCurrectAnswer == null">
        <v-spacer></v-spacer>

        <v-btn icon @click="clear" color="red lighten-3">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: "exam-card-compo",
  props: ["item"],
  data() {
    return {
      selected_answer_s: [],
      isCurrectAnswer: null,
      currectAnswer: null,
    };
  },
  computed: {
    submitionTrigger() {
      return this.$store.getters["submitTrigger/triggerValue"];
    },
  },
  watch: {
    submitionTrigger(value) {
      if (value) {
        this.checkAnswer();
      } else {
        this.selected_answer_s = [];
        this.isCurrectAnswer = null;
      }
    },
  },
  methods: {
    // answer() {
    //   this.$emit("answer");
    // },
    stringToList(value) {
      try {
        var list = value.split(",");
        return list ?? [];
      } catch (error) {
        return [];
      }
    },
    clear() {
      this.selected_answer_s = [];
    },
    checkAnswer() {
      if (this.item.question_type == "Single Answer") {
        if (this.item.currect_answers == this.selected_answer_s) {
          this.isCurrectAnswer = true;
        } else {
          this.isCurrectAnswer = false;
        }
      } else if (this.item.question_type == "Multiple Answer") {
        var value = false;
        // Find out if have currect answers
        for (const key in this.selected_answer_s) {
          value = this.stringToList(this.item.currect_answers).some(
            (element) => element == this.selected_answer_s[key]
          );
          if (!value) break;
        }
        // check the currect answers length, if value is true
        if (value)
          if (
            this.stringToList(this.item.currect_answers).length !=
            this.selected_answer_s.length
          )
            value = false;
        // set value to globle variable
        this.isCurrectAnswer = value;
      } else {
        console.log("Upload Answer");
      }
    },
  },
};
</script>

<style lang="scss">
.height-of-radio {
  max-height: none !important;
}
// .v-radio > .v-label {
//   color: white !important;
// }
</style>