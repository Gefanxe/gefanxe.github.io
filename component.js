let tpl = `
<div>
    <p>Hi  {{ def }}</p> 
    <button @click="handleClick">click me</button>
    <hr>
    concat string <input type="text" v-model="firstStr" > <br>
    unix timestamp <input type="text" v-model="unix" > <br>
    <button @click="handleGenerateUnixTime">Gen Unix Time</button>
</div>
`;

Vue.component('ex', {
    props: ['name'],
    template: tpl,
    data() {
        return {
            def: 'this is component',
            firstStr: '',
            unix: ''
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
        }
    }
})