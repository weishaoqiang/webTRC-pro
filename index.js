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

var video = document.querySelector("video");
var cvs1 = document.querySelector("#canvas1"),
	ctx1 = cvs1.getContext('2d');
var cvs2 = document.querySelector("#canvas2"),
	ctx2 = cvs2.getContext('2d');
var takePicture = document.querySelector("#take-picture");

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
var constraints = { audio: true, video: { facingMode: { exact: "environment" }, width: 1280, height: 720 } };

var mediaPromise = navigator.mediaDevices.getUserMedia(constraints);

mediaPromise.catch(function(err) {
  console.log(err.name + ": " + err.message);
});

mediaPromise.then(function(stream) {
  // 当指定的音频/视频的元数据已加载时
  video.src = window.URL.createObjectURL(stream);
  video.onloadedmetadata = function(e) {
  	video.play();
  };
})

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

var rander = function(){
	ctx1.drawImage(video, 0, 0);
	// ctx2.drawImage(video, 0, 0);
	requestAnimationFrame(rander);
	var imageData = ctx1.getImageData(0, 0, 300, 150);
    ctx1.putImageData(grayscale(imageData),0, 0);
}
rander();

// 注册点击事件拍照
takePicture.addEventListener("click", function(){
	// 将视屏画在画布上
	// ctx1.drawImage(video, 0, 0);
	// var img = document.querySelector("img");
	// img.src = canvas1.toDataURL('image/jpeg');
	console.log(video.width, video.height);
	var imageData = ctx1.getImageData(0, 0, 300, 150);
	console.log(imageData);
})
