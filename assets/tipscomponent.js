let tpl = `
<v-card max-width="344" class="mx-auto">
    <v-list-item>
        <v-list-item-avatar color="grey" v-text="index"></v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title class="headline" v-text="title">Our Changing Planet</v-list-item-title>
        </v-list-item-content>
    </v-list-item>

    <v-img src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg" height="194"></v-img>

<v-card-text>
    Visit ten places on our planet that are undergoing the biggest changes today.
</v-card-text>

<v-card-actions>
    <v-btn
    text
    color="deep-purple accent-4"
    >
    Read
    </v-btn>
    <v-btn
    text
    color="deep-purple accent-4"
    >
    Bookmark
    </v-btn>
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

Vue.component('tip-cards', {
    props: {
        tip: {
            type: Object,
            default: function() {
                return {
                    index: 99,
                    title: '提示卡標題',
                    content: '提示卡內容描述',
                    img: 'https://cdn.vuetifyjs.com/images/cards/mountain.jpg'
                }
            }
        }
    },
    template: tpl,
    data() {
        return {
            index: this.tip.index,
            title: this.tip.title,
            content: this.tip.content,
            img: this.tip.img
        }
    },
    created() {
        console.log('component created!');
    },
    methods: {
        // handleClick() {
        //     console.log('button click!');
        // },
        // handleGenerateUnixTime() {
        //     this.unix = this.firstStr + (Math.floor(Date.now() / 1000)).toString();
        //     console.log(this.unix);
        // },
        // handleReductionUnixTime() {
        //     let myRe = /\d{10,}/gm;
        //     let str = this.unix;
        //     let result = myRe.exec(str);
        //     console.log(result);
        //     let now = new Date(result[0] * 1000).Format("yyyy-M-d h:m:s");
        //     this.now = now;
        // }
    }
})