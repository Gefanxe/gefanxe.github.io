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
      mem: {},
      showIdx: 0,
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
      handleChangeCard() {
        var usedCount = this.used.length;
        if (usedCount < (this.total - 1)) {
          var rand = Math.floor(Math.random() * ((this.total - 1) - usedCount)) + 1;
          // var selected = this.unuse.splice(rand, 1)[0];
          // console.log('selected', selected);
          this.showIdx = rand;
          console.log('showIdx:', this.showIdx);
        } else {
          alert('沒東西了')
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
          console.log('keyCode:', evt.keyCode);
          if (evt.keyCode === 32) {
            self.handleChangeCard();
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
          for (let index = 0; index < this.total - 1; index++) {
            this.unuse.push(index + 1);
          }
          // 先取一個
          this.showIdx = Math.floor(Math.random() * (this.total - 1)) + 1
          console.log('showIdx:', this.showIdx);
        }
      }
    }
  });
});
