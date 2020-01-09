let tpl = `
<div>
    <p>Hi  {{ def }}</p> 
    <button @click="handleClick">click me</button>
    <hr>
    concat string <input type="text" v-model="firstStr" > <br>
    unix timestamp <input type="text" v-model="unix" > <br>
    <button @click="handleGenerateUnixTime">Gen Unix Time</button>
    <button @click="handleReductionUnixTime">Reduction Unix Time</button> <br>
    transfer <input type="text" v-model="now" >
</div>
`;

Vue.component('ex', {
    props: ['name'],
    template: tpl,
    data() {
        return {
            def: 'this is component',
            firstStr: '',
            unix: '',
            now: ''
        }
    },
    created() {
        console.log('component created!');
    },
    methods: {
        handleClick() {
            console.log('button click!');
        },
        handleGenerateUnixTime() {
            this.unix = this.firstStr + (Math.floor(Date.now() / 1000)).toString();
            console.log(this.unix);
        },
        handleReductionUnixTime() {
            let myRe = /\d{10,}/gm;
            let str = this.unix;
            let result = myRe.exec(str);
            console.log(result);
            let now = new Date(result[0] * 1000).Format("yyyy-M-d h:m:s");
            this.now = now;
        }
    }
})