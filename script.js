$(document).ready(function () {
  var video = document.getElementById("videoElement");
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var captureButton = document.getElementById("captureButton");

  var imageCount = 0;

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Could not access the camera: " + error);
    });

  captureButton.addEventListener("click", function () {
    captureImage();
    setTimeout(captureImage, 2000);
  });

  function captureImage() {
    context.drawImage(video, 0, 0, 270, 150);
    canvas.toBlob(function (blob) {
      var formData = new FormData();
      formData.append("image" + (imageCount + 1), blob);
      processImage(formData);
      imageCount++;
    });
  }

  function processImage(formData) {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://antispoof.azurewebsites.net/api/http_triggerspf?"
    );
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        var response = JSON.parse(xhr.responseText);
        console.log(response);
        // Handle the response and update UI accordingly
      } else {
        console.error("Error processing image: " + xhr.statusText);
      }
    };
    xhr.onerror = function () {
      console.error("Error processing image: " + xhr.statusText);
    };
    xhr.send(formData);
  }
});
