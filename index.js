/**
 * author: weishaoqiang
 * Date: 2017/10/31
 * description: webTRC的简单项目，主要目的是实现两端的视频通信
 * 
 * WebRTC是Web Real-Time Communication(网页实时通信)。WebRTC 包含有三个组件
 *  1. 访问用户摄像头及麦克风的 getUserMedia 
 *  2. 穿越 NAT 及防火墙建立视频会话的 PeerConnection（对等连接）
 *  3. 在浏览器之间建立点对点数据通讯的 DataChannels （数据通道）
 */

var yourvideo = document.querySelector("video");
var theirvideo = document.querySelector("#thierVideo");
console.log(theirvideo)
// var cvs1 = document.querySelector("#canvas1"),
// 	ctx1 = cvs1.getContext('2d');
// var cvs2 = document.querySelector("#canvas2"),
// 	ctx2 = cvs2.getContext('2d');
// var takePicture = document.querySelector("#take-picture");

// 兼容旧版本浏览器navigator.getUserMedia获取摄像头信息。
var promisifiedOldGUM = function(constraints) {

  // First get ahold of getUserMedia, if present
  var getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
  // Some browsers just don't implement it - return a rejected promise with an error
  // to keep a consistent interface
  if(!getUserMedia) {
    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
  }

  // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
  return new Promise(function(resolve, reject) {
    getUserMedia.call(navigator, constraints, resolve, reject);
  });
}

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if(navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if(navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
}


// Prefer camera resolution nearest to 1280x720.
var constraints = { audio: false, video: { facingMode: { exact: "environment" }, width: 1280, height: 720 } };

var mediaPromise = navigator.mediaDevices.getUserMedia(constraints);

mediaPromise.catch(function(err) {
  console.log(err.name + ": " + err.message);
});

mediaPromise.then(function(stream) {
  // 当指定的音频/视频的元数据已加载时
  // video.src = window.URL.createObjectURL(stream);
  video.srcObject = stream;
  if (!!PeerConnection) {
    startPeerConnection(stream);
  } else {
    alert("没有RTCPeerConnection API");
  }
  video.onloadedmetadata = function(e) {
  	video.play();
  };
})

// 视频风格设置
function grayscale(pixels) {
    var d = pixels.data;

    for (var i = 0, len = d.length; i < len; i += 4) {
        var r = d[i],
            g = d[i + 1],
            b = d[i + 2];

        d[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
        d[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
        d[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
    }

    return pixels;
}

// canvas渲染函数
// var rander = function(){
// 	ctx1.drawImage(video, 0, 0);
// 	// ctx2.drawImage(video, 0, 0);
// 	requestAnimationFrame(rander);
// 	var imageData = ctx1.getImageData(0, 0, 1280, 720);
//     ctx1.putImageData(grayscale(imageData),0, 0);
// }
// rander();

// 注册点击事件拍照
// takePicture.addEventListener("click", function(){
// 	// 将视屏画在画布上
// 	// ctx1.drawImage(video, 0, 0);
// 	// var img = document.querySelector("img");
// 	// img.src = canvas1.toDataURL('image/jpeg');
// 	console.log(video.width, video.height);
// 	var imageData = ctx1.getImageData(0, 0, 1280, 720);
// 	console.log(imageData);
// })


/**
 * RTCPeerConnection，用于peer跟peer之间呼叫和建立连接以便传输音视频数据流；
 * 在能够通信前peer跟peer之间必须建立连接,为此需要借助一个信令服务器（signaling server）来进行,
 * 1. Session control messages: 初始化和关闭通信，及报告错误；
 * 2. Network configuration: 双方的IP地址和端口号（局域网内部IP地址需转换为外部的IP地址）；
 * 3. Media capabilities: 双方的浏览器支持使用何种codecs以及多高的视频分辨率。
 */

/**
 * [浏览器兼容处理]
 */
var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
navigator.getUserMedia = navigator.getUserMedia ? "getUserMedia" :
    navigator.mozGetUserMedia ? "mozGetUserMedia" :
    navigator.webkitGetUserMedia ? "webkitGetUserMedia" : "getUserMedia";
// var v = document.createElement("video");

// var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;


// 创建信令
// var sdp,desc;
// var pc = new PeerConnection();
// pc.addStream(video);
// pc.createOffer(function(desc) {
//     pc.setLocalDescription(desc, function() {
//         // send the offer to a server that can negotiate with a remote client
//         sdp = desc.sdp;
//         desc = desc;
//         console.log(desc);
//     });
// },function(faild){

// })

// console.log(pc.canTrickleIceCandidates);
// 创建回复
// var pc = new PeerConnection();
// var sessionDescription = new RTCSessionDescription(sdp);
// console.log(pc);
// console.log(sessionDescription);
// pc.setRemoteDescription(desc, function() {
//     pc.createAnswer(function(answer) {
//         pc.setLocalDescription(answer, function() {
//             // send the answer to the remote connection
//             // console.log(answer);
//         });
//     });
// })
// var desc = new RTCSessionDescription(sdp);

// pc.setRemoteDescription(desc).then(function() {
// 	return mediaPromise;
// })
// .then(function(stream) {
//   previewElement.srcObject = stream;

//   stream.getTracks().forEach(track => {pc.addTrack(track, stream);cosnole.log(track)});
// })
// 


function startPeerConnection(stream) {
    //这里使用了几个公共的stun协议服务器
    var config = {
        'iceServers': [{ 'url': 'stun:stun.services.mozilla.com' }, { 'url': 'stun:stunserver.org' }, { 'url': 'stun:stun.l.google.com:19302' }]
    };
    yourConnection = new PeerConnection(config);
    theirConnection = new PeerConnection(config);

    yourConnection.onicecandidate = function(e) {
        if (e.candidate) {
            theirConnection.addIceCandidate(new RTCIceCandidate(e.candidate));
        }
    }
    theirConnection.video = function(e) {
        if (e.candidate) {
            yourConnection.addIceCandidate(new RTCIceCandidate(e.candidate));
        }
    }

    theirConnection.onaddstream = function(e) {
        theirvideo.src = window.URL.createObjectURL(e.stream);
    }
    yourConnection.addStream(stream);

    //本方产生了一个offer
    yourConnection.createOffer().then(offer => {
        yourConnection.setLocalDescription(offer);
        //对方接收到这个offer
        yourConnection.setRemoteDescription(offer);
        //对方产生一个answer
        yourConnection.createAnswer().then(answer => {
            yourConnection.setLocalDescription(answer);
            //本方接收到一个answer
            yourConnection.setRemoteDescription(answer);
        })
    });
}
