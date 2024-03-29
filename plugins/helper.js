import moment from "moment";
import Vue from "vue";
import jwt from "jsonwebtoken";

Vue.mixin({
  computed: {
    filterValue() {
      return this.$store.getters["filter/filterValue"];
    },
  },
  methods: {
    dateTimeFormater(value) {
      var data;
      if (value != null) data = moment(value?.toDate()).format("YYYY-MM-DD");
      return data;
    },
    filtering(value, originalList) {
      try {
        var list = originalList;
        // Grade
        if (value[0] != "All" && value[0] != null)
          list = list.filter((element) => element.grade == value[0]);
        // Subject
        if (value[1] != "All" && value[1] != null)
          list = list.filter((element) => element.subject == value[1]);
        return list;
      } catch (error) {
        console.log(error);
      }
    },
    buy(item, buy_item) {
      try {
        // Create jwt token
        let token = jwt.sign(
          JSON.stringify({
            ...item,
            buy_item: buy_item,
          }),
          "buy_item"
        );
        this.$router.push({ path: "payment", query: { dt: token } });
        // * Student bought_videos
        // b_id
        // id // v_id
        // price
        // bought_date
        // transaction_id
        // exp_date
        //
        // * Teacher soled_videos
        // b_id
        // id // v_id
        // price
        // bought_date
        // transaction_id
        // exp_date
        // student_id
      } catch (error) {
        console.log(error);
      }
    },
  },
});
