// ===== INIT
$(document).ready(function() {
    // materialize
    $('.sidenav').sidenav()
    $('.tabs').tabs()
    $('.modal').modal()

    // init
    listStamp()

    // 全ての処理が完了したら実行
    setTimeout(function() {
        $('#loading-box').addClass('animation-loading-loaded')
    }, 500)
})

// ===== SYS
function listStamp() {
    //$('#')
}

// ===== STAMP

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

function tick() {
    if(isStopped !== true) {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.height = video.videoHeight
            canvasElement.width = video.videoWidth
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height)
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height)
            var code = jsQR(imageData.data, imageData.width, imageData.height)
            if (code) {
                // コード検出時
                checkStampID(code.chunks[1].text)
                document.getElementById('video').srcObject.getTracks().forEach(track => {track.stop()})
                document.getElementById('video').srcObject = null //オブジェクトを開放する
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

        $('#hijiri-modal-content').html('<video id="video" class="hj-read-qr"></video><p class="hj-read-text" id="finding">QRコードをさがしています...</p>')
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
}

// スタンプID一覧
const STAMPS = {
    'B9D5CFC6': 'stamp1',
    'F53A540F': 'stamp2',
    '0AB8CD2F': 'stamp3',
    '99B37C9B': 'stamp4',
    '7FD688C4': 'stamp5',
    '84B81741': 'stamp6',
    '6D6B4D7E': 'stamp7',
    '90077EBC': 'stamp8',
    '44D0E422': 'stamp9',
    'C761F3D3': 'stamp10'
}

// スタンプID確認
function checkStampID(code) {
    $('#finding').text(code)
    /*
    if(config.get('stamps') === undefined) {
        var o = [].push(STAMPS[code])
        config.set('stamps', JSON.stringify(o))
        getStamp(true, STAMPS[code])
    } else {
        var o = JSON.perse(config.get('stamps'))
        if(o.indexOf(STAMPS[code]) !== -1) {
            getStamp(false, STAMPS[code])
        } else {
            o.push(STAMPS[code])
            config.set('stamps', JSON.stringify(o))
            getStamp(true, STAMPS[code])
        }
    }
    */
}

function getStamp(flag, id) {
    console.log(flag + ':' + id)
    if(flag) {
        // new stamp

    } else {
        // owned stamp
    }
}