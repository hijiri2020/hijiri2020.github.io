// ===== INIT
config.prefix('hijiri')

$(document).ready(function() {
    // materialize
    $('.sidenav').sidenav()
    $('.tabs').tabs()
    $('.modal').modal({
        dismissible: false
    })

    // init
    listStamp()

    // 全ての処理が完了したら実行
    setTimeout(function() {
        $('#loading-box').addClass('animation-loading-loaded')
        setTimeout(function() {
            $('#loading-box').remove()
        }, 1500)
    }, 500)
})

// ===== CONF
// スタンプID一覧
const STAMPS = {
    'B9D5CFC6': 'スタンプ1',
    'F53A540F': 'スタンプ2',
    '0AB8CD2F': 'スタンプ3',
    '99B37C9B': 'スタンプ4',
    '7FD688C4': 'スタンプ5',
    '84B81741': 'スタンプ6',
    '6D6B4D7E': 'スタンプ7',
    '90077EBC': 'スタンプ8',
    '44D0E422': 'スタンプ9',
    'C761F3D3': 'スタンプ10'
}

// ===== SYS
function listStamp() {
    // init
    $('#hj-stamp-container').empty()

    if(config.get('stamps') === undefined) {
        config.set('stamps', '[]')
    }

    var s = JSON.parse(config.get('stamps'))
    var o = Object.values(STAMPS)
    for(var i = 0; o.length > i; i++) {
        if(s.indexOf(o[i]) === -1) {
            // 未取得
            $('#hj-stamp-container').append('<div><img src="img/stamp_gray.png"><p>' + o[i] + '</p></div>')
        } else {
            // 取得済み
            $('#hj-stamp-container').append('<div><img src="img/stamp_color.png"><p>' + o[i] + '</p></div>')
        }
    }

    for(var i = 0; o.length > i; i++) {
        $('#hj-stamp-container').append('<div class="space"></div>')
    }
}

var tap_burst = new mojs.Burst({
    className: 'hj-tap-effect',
    radius: {0 : 100},
    count: 'rand(5, 10)',
    opacity: {1 : 0},
    left: '0%',
    top: '0%',
    children: {
      shape: 'polygon',
      points: 5,
      fill: {'cyan' : 'yellow'},
      duration: 1500
    }
})

$(document).on('click', function(e) {
    tap_burst
        .tune({x: e.pageX, y: e.pageY})
        .generate()
        .replay()
})

// ===== STAMP

// QR読み取り
$('#hj-stamp-qrreader').on('click', function() {
    // 権限確認
    if(config.get('video-permission') === undefined) {
        // 権限確認Modalを開く
        $('#hijiri-modal-content').html('<p>QRコードを読み取るために、次の画面でカメラ使用を許可してください。</p>')
        $('#hijiri-modal-footer').html('<a href="#!" onclick="readQR()" class="modal-close waves-effect waves-green btn-flat">OK</a>')
        M.Modal.getInstance($('#hijiri-modal')).open()
    } else {
        readQR()
    }
})

// QR読み取り

var canvasElement = document.createElement('canvas')
canvasElement.height = this.height
canvasElement.width = this.width
var canvas = canvasElement.getContext('2d')

resized = false

function tick() {
    if(isStopped !== true) {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            if(resized === false) {
                resized = true

                var bvw = $('#hj-read-qr-box').width()
                $('#hj-read-qr-box').css('height', bvw)

                var vh = $('#video').height()
                var vw = $('#video').width()

                if(vh > vw) {
                    $('#video').css('height', ((vh / vw) * bvw))
                } else {
                    $('#video').css('width', ((vw / vh) * bvw))
                }
            }

            canvasElement.height = video.videoHeight
            canvasElement.width = video.videoWidth
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height)
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height)
            var code = jsQR(imageData.data, imageData.width, imageData.height)
            if (code) {
                // コード検出時
                document.getElementById('video').srcObject.getTracks().forEach(track => {track.stop()})
                document.getElementById('video').srcObject = null //オブジェクトを開放する
                checkStampID(code.chunks[1].text) // chunk2から取り出す
                resized = false
                return null
            } else {
                // コード未検知時
            }
        }
        requestAnimationFrame(tick)
    } else {
        document.getElementById('video').srcObject.getTracks().forEach(track => {track.stop()})
        document.getElementById('video').srcObject = null //オブジェクトを開放する
        return null
    }
}

function readQR() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function(stream) {
        isStopped = false

        $('#hijiri-modal-content').html('<div id="hj-read-qr-box" class="hj-read-qr-box"><video id="video" class="hj-read-qr"></video><div></div></div><p class="hj-read-text" id="finding">QRコードをさがしています...</p>')
        $('#hijiri-modal-footer').html('<a href="#!" onclick="stopReadQR()" class="modal-close waves-effect waves-green btn-flat">キャンセル</a>')
        M.Modal.getInstance($('#hijiri-modal')).open()

        config.set('video-permission', 'granted')       

        video = document.getElementById('video')
        video.srcObject = stream
        video.setAttribute('playsinline', true) // required to tell iOS safari we don't want fullscreen
        video.play()
        requestAnimationFrame(tick)
    }).catch(err => {
        $('#hijiri-modal-content').html('<p>カメラを起動できませんでした。ブラウザが対応していないか、カメラ使用を拒否している可能性があります。</p>')
        $('#hijiri-modal-footer').html('<a href="#!" class="modal-close waves-effect waves-green btn-flat">OK</a>')
        M.Modal.getInstance($('#hijiri-modal')).open()
    })
}

function stopReadQR() {
    isStopped = true
    resized = false
}

// スタンプID確認
function checkStampID(code) {
    var o = JSON.parse(config.get('stamps'))
    if(o.indexOf(STAMPS[code]) !== -1) {
        getStamp(false, STAMPS[code])
    } else {
        o.push(STAMPS[code])
        config.set('stamps', JSON.stringify(o))
        getStamp(true, STAMPS[code])
    }
}

function getStamp(flag, id) {
    M.Modal.getInstance($('#hijiri-modal')).close()
    console.log(flag + ':' + id)
    if(flag) {
        // new stamp
        listStamp()

        $('#hijiri-modal-content').html('<div class="hj-stamp-img" id="hj-stamp-img"><img src="img/stamp_color.png"></div><p class="hj-read-text">新しいスタンプをゲットしました！</p>')
        $('#hijiri-modal-footer').html('<a href="#!" class="modal-close waves-effect waves-green btn-flat">OK</a>')
        M.Modal.getInstance($('#hijiri-modal')).open()
    } else {
        // owned stamp
        $('#hijiri-modal-content').html('<div class="hj-stamp-img" id="hj-stamp-img"><img src="img/stamp_color.png"></div><p class="hj-read-text">このスタンプは既にゲットしているようです...</p>')
        $('#hijiri-modal-footer').html('<a href="#!" class="modal-close waves-effect waves-green btn-flat">OK</a>')
        M.Modal.getInstance($('#hijiri-modal')).open()
    }

    // new stamp animation
    stamp_burst = new mojs.Burst({
        parent: '#hj-stamp-img',
        radius:   { 130: 200 },
        count:    10,
        angle:    { 0: 90 },
        opacity:  { 1: 0 },
        top: '40%',
        children: {
            shape: 'polygon',
            points: 5,
            duration: 2000
            }
    })

    setTimeout(function() {
        stamp_burst.replay()
    }, 700)
}