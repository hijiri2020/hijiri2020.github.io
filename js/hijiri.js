$(document).ready(function() {
    // materialize
    $('.sidenav').sidenav()
    $('.tabs').tabs()

    // 全ての処理が完了したら実行
    setTimeout(function() {
        $('#loading-box').addClass('animation-loading-loaded')
    }, 500)
})