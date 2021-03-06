// https://picsum.photos/id/1/344/194

document.addEventListener("DOMContentLoaded", function () {
  let vue = new Vue({
    el: "#app",
    data: {
      message: "Hello World!",
      tips_list: {
        "data": [
          {
            "index": 0,
            "title": "讀取中...",
            "content": "讀取中...",
            "imgid": 0
          }
        ]
      },
      loadTips: false,
      showIdx: 0,
      realShowIdx: 0,
      showIdxVal: 0,
      total: 0,
      used: [],
      unuse: []
    },
    created: function () {
      console.log("created !!");

      this.loadJsonData(this.changeLoadTipsStatus);
    },
    mounted: function() {
      console.log("mounted!");
    },
    watch: {
      loadTips: function(value) {
        if (value) {
          this.initProcessData();
        }
      }
    },
    methods: {
      resetProcessArray() {
        this.used = [];
        for (let index = 0; index < this.total - 1; index++) {
          this.unuse.push(index + 1);
        }
      },
      handleReadTip() {
        console.log('realShowIdx:', this.realShowIdx);
        console.log('used.includes?', this.used.includes(this.realShowIdx));
        if (!this.used.includes(this.realShowIdx)) {
          if (this.used.length < (this.total - 1)) {
            this.showIdxVal = this.unuse.splice((this.showIdx - 1), 1)[0]
            this.used.push(this.showIdxVal);
          
            console.log('this.used.length:', this.used.length);
            console.log('total - 1:', (this.total - 1));
            if (this.used.length === (this.total - 1)) this.resetProcessArray();
          }
        }
      },
      handleChangeCard() {
        if (this.used.length < (this.total - 1)) {
          var rand = Math.floor(Math.random() * ((this.total - 1) - this.used.length)) + 1;
          this.showIdx = rand;
          this.realShowIdx = this.unuse[this.showIdx - 1];
          
          console.log('this.used.length:', this.used.length);
          console.log('total - 1:', (this.total - 1));
          if (this.used.length === (this.total - 1)) this.resetProcessArray();
        }
      },
      handleTest() {
        
      },
      // 讀取提示Json資料
      loadJsonData(nextFunction) {
        let self = this;
        fetch('/tips_list.json').then(function(response) {
          return response.json();
        }).then(function(myJson) {
          self.tips_list.data = self.tips_list.data.concat(myJson.data);
          self.total = self.tips_list.data.length;
          if (nextFunction) nextFunction();
        });
      },
      changeLoadTipsStatus() {
        let self = this;
        self.loadTips = true;
        window.addEventListener('keyup', function(evt) {
          // console.log('keyCode:', evt.keyCode);
          if (evt.keyCode === 32) {
            self.handleChangeCard();
          }
          if (evt.keyCode === 82) {
            self.handleReadTip();
          }
        });
      },
      initProcessData() {
        let mem = localStorage.getItem('mem');
        if (mem) {
          this.showIdx = mem.showIdx;
          this.used = mem.used;
          this.unuse = mem.unuse;
        } else {
          this.resetProcessArray();
          // 先取一個
          this.showIdx = Math.floor(Math.random() * (this.total - 1)) + 1
          this.realShowIdx = this.unuse[this.showIdx - 1];
        }
      }
    }
  });
});
