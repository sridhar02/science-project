if (typeof DeviceMotionEvent.requestPermission === "function") {
  // Request permission to access the accelerometer if available
  DeviceMotionEvent.requestPermission()
    .then((permissionState) => {
      if (permissionState === "granted") {
        // DeviceMotionEvent is supported and permission is granted
        window.addEventListener("devicemotion", handleMotion);
      } else {
        // Permission denied, display an error message
        showError("Permission to access the accelerometer is denied.");
      }
    })
    .catch((error) => {
      // Handle errors
      showError("Error requesting accelerometer permission: " + error.message);
    });
} else {
  // DeviceMotionEvent is not supported in this browser
  showError("Accelerometer API is not supported in this browser.");
}

function handleMotion(event) {
  // Extract accelerometer values
  const accelerationX = event.acceleration.x;
  const accelerationY = event.acceleration.y;
  const accelerationZ = event.acceleration.z;

  // Update the UI with the values
  document.getElementById("x-value").textContent = accelerationX.toFixed(2);
  document.getElementById("y-value").textContent = accelerationY.toFixed(2);
  document.getElementById("z-value").textContent = accelerationZ.toFixed(2);
}

function showError(message) {
  // Display an error message in the UI
  const errorElement = document.createElement("p");
  errorElement.textContent = message;
  errorElement.style.color = "red";
  document.getElementById("acceleration-values").appendChild(errorElement);
}
