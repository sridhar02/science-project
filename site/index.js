document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("password") === "1234") {
    showCameraSection();
    hideLoginSection();
  }
});

document.getElementById("loginButton").addEventListener("click", function () {
  var password = document.getElementById("passwordInput").value;
  if (password === "1234") {
    localStorage.setItem("password", password);
    hideLoginSection();
    showCameraSection();
  } else {
    alert("Incorrect Password!");
  }
});

function hideLoginSection() {
  document.getElementById("loginSection").style.display = "none";
}

function showCameraSection() {
  document.getElementById("cameraSection").style.display = "block";
  startCamera();
}

function startCamera() {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: {
          min: 1280,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 720,
          ideal: 1080,
          max: 1440,
        },
        facingMode: {
          exact: "environment",
        },
      },
    })
    .then(function (stream) {
      var video = document.getElementById("cameraStream");
      video.srcObject = stream;
      video.style.display = "block";
      document.getElementById("imagePreview").style.display = "none";
    })
    .catch(function (err) {
      console.log("An error occurred: " + err);
    });
}

document.getElementById("captureButton").addEventListener("click", function () {
  var video = document.getElementById("cameraStream");
  var canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 720;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(function (blob) {
    var url = URL.createObjectURL(blob);
    document.getElementById("imagePreview").src = url;
    document.getElementById("imagePreview").style.display = "block";
    video.style.display = "none";
    document.getElementById("sendButton").style.display = "block";
  }, "image/jpeg");
});

document.getElementById("sendButton").addEventListener("click", function () {
  var canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 720;
  canvas
    .getContext("2d")
    .drawImage(
      document.getElementById("cameraStream"),
      0,
      0,
      canvas.width,
      canvas.height
    );
  canvas.toBlob(function (blob) {
    sendImageToAPI(blob);
    startCamera();
  }, "image/jpeg");
});

const API = "https://api.sridhar02.workers.dev";

function sendImageToAPI(imageBlob) {
  const uuid = self.crypto.randomUUID();

  console.log({ uuid });

  fetch(`${API}/${uuid}`, {
    method: "PUT",
    body: imageBlob,
    mode: "cors",
    headers: {
      "content-type": "application/octet-stream",
      accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("apiResponse").innerText = JSON.stringify(
        data.content,
        null,
        2
      );
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("apiResponse").innerText = "Error: " + error;
    });
}
