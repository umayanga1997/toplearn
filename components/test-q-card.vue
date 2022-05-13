<template >
  <v-col cols="12" md="6" lg="5" sm="6" xl="5" class="ma-0 pa-2">
    <v-card>
      <v-card-title class="blue--text text--lighten-2">
        Q) {{ item.question }}
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
          v-model="selected_answer_s"
          v-for="item in stringToList(item.answers)"
          :key="item"
          :label="item"
          :value="item"
          class="ma-0"
        ></v-checkbox>
      </div>
      <div class="height-of-radio pa-4 ma-0 pb-0" v-else>Upload</div>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn icon @click="clear" color="red lighten-3">
          <v-icon>mdi-close</v-icon>
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
    };
  },
  methods: {
    answer() {
      this.$emit("answer");
    },
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
  },
};
</script>

<style lang="scss">
.height-of-radio {
  max-height: none !important;
}
.v-radio > .v-label {
  color: white !important;
}
</style>