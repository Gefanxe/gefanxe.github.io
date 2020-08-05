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
            "img": "/assets/Loading.png"
          }
        ]
      },
      loadTips: false
    },
    created: function () {
      console.log("created !!");

      this.loadJsonData(this.changeLoadTipsStatus);
    },
    mounted: function() {
      console.log("mounted!");
    },
    methods: {
      handleChangeCard() {
        console.log('change !!!');
      },
      handleTest() {

      },
      // 讀取提示Json資料
      loadJsonData(cb) {
        let self = this;
        fetch('/tips_list.json').then(function(response) {
          return response.json();
        }).then(function(myJson) {
          self.tips_list.data = myJson.data;
          if (cb) cb();
        });
      },
      changeLoadTipsStatus() {
        this.loadTips = true;
      }
    }
  });
});
