let tpl = `
<div>
    <p>Hi  {{ def }}</p> 
    <button @click="handleClick">click me</button>
</div>
`;

Vue.component('ex', {
    props: ['name'],
    template: tpl,
    data() {
        return {
            def: 'this is component'
        }
    },
    created() {
        console.log('component created!');
    },
    methods: {
        handleClick() {
            console.log('button click!');
        }
    }
})