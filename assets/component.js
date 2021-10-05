let tpl = `
<div>
    <p>Hi  {{ def }}</p> 
    <button @click="handleClick">click me</button>
    <hr>
    concat string <input type="text" v-model="firstStr" > <br>
    unix timestamp <input type="text" v-model="unix" size="30"> <br>
    <button @click="handleGenerateUnixTime">Gen Unix Time</button>
    <button @click="handleReductionUnixTime">Reduction Unix Time</button> <br>
    transfer <input type="text" v-model="now" > <br>
    quadratic bezier points Convert to xy json value <br>
    <input type="text" v-model="brPoint" size="80"> <span style="color: red;">{{ errMsg }}</span> <br>
    <button @click="brTransfer">transfer</button>
    result:<pre>{{ brResult }}</pre>
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
            now: '',
            brPoint: '',
            errMsg: '',
            brResult: ''
        }
    },
    created() {
        console.log('component created!');
    },
    methods: {
        brTransfer() {
            const self = this;
            if (self.brPoint !== '') {
                let brArr = self.brPoint.split(',');
                let c = brArr.length;
                let p = (c / 2) % 5;
                if (p === 0 && (c / 2) >= 3) {
                    let resultObj = '';
                    let point = {};
                    brArr.forEach((item, idx, array) => {
                        if ((idx % 2) === 0) {
                            point.x = item;
                        } else {
                            point.y = item;
                            resultObj += `{x: ${point.x}, y: ${point.y}}` + ",\n";
                            point = {};
                        }
                    });
                    self.brResult = "[\n" + resultObj + "]";
                } else {
                    self.errMsg = '座標點必須為奇數(3個點以上)';
                }
            }
        },
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