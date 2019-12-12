document.addEventListener("DOMContentLoaded", function () {
    let vue = new Vue({
        el: '#app',
        data: {
            message: 'Hello World!'
        },
        created: function () {
            console.log('created event fired in app.')
        }
    })
});