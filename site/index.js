document.addEventListener("DOMContentLoaded", function () {
  // Check if the password is already stored in local storage
  if (localStorage.getItem("password") === "1234") {
    // Replace with your actual password
    showCameraSection();
    hideLoginSection();
  }
});

document.getElementById("loginButton").addEventListener("click", function () {
  var password = document.getElementById("passwordInput").value;
  if (password === "1234") {
    // Replace with your actual password
    localStorage.setItem("password", password);
    hideLoginSection(); // Store the password in local storage
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
    .getUserMedia({ video: true })
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
  canvas.width = 320;
  canvas.height = 240;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(function (blob) {
    var url = URL.createObjectURL(blob);
    document.getElementById("imagePreview").src = url;
    document.getElementById("imagePreview").style.display = "block";
    video.style.display = "none"; // Hide the video element
    document.getElementById("sendButton").style.display = "block";
  }, "image/jpeg");
});

document.getElementById("sendButton").addEventListener("click", function () {
  var canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 240;
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
    startCamera(); // Restart camera preview after sending the image
  }, "image/jpeg");
});

const API = "https://api.sridhar02.workers.dev";

function sendImageToAPI(imageBlob) {
  const uuid = self.crypto.randomUUID();

  console.log({ uuid });

  fetch(`${API}/${uuid}`, {
    method: "PUT",
    body: imageBlob,
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("apiResponse").innerText = JSON.stringify(
        data,
        null,
        2
      );
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("apiResponse").innerText = "Error: " + error;
    });
}
