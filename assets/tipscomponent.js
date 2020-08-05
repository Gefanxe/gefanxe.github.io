let tpl = `
<v-card max-width="344" class="mx-auto">
    <v-list-item>
        <v-list-item-avatar color="grey" v-text="index"></v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title class="headline" v-text="title"></v-list-item-title>
        </v-list-item-content>
    </v-list-item>

    <v-img v-bind:src="img" height="194"></v-img>

<v-card-text v-text="content"></v-card-text>

<v-card-actions>
    <v-btn @click="handleClick">Read</v-btn>
    <v-spacer></v-spacer>
    <v-btn icon>
        <v-icon>mdi-heart</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-share-variant</v-icon>
    </v-btn>
</v-card-actions>
</v-card>
`;

Vue.component("tip-cards", {
  props: {
    tip: {
      type: Object,
      default: function () {
        return {
          index: 99,
          title: "提示卡標題",
          content: "提示卡內容描述",
          img: "https://cdn.vuetifyjs.com/images/cards/mountain.jpg",
        };
      },
    },
  },
  computed: {
    index: {
      get() {
        return this.tip.index;
      },
    },
    title: {
      get() {
        return this.tip.title;
      },
    },
    content: {
      get() {
        return this.tip.content;
      },
    },
    img: {
      get() {
        return this.tip.img;
      },
    },
  },
  template: tpl,
  created() {
    console.log("component created!");
  },
  methods: {
    handleClick() {
      console.log('compoment data:', this.title);
    }
  },
});
