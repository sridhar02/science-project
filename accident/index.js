document.addEventListener("DOMContentLoaded", function () {
  // Get the button element
  let button = document.getElementById("acc");
  // Get the elements we want to write to
  let xElement = document.getElementById("x");
  let yElement = document.getElementById("y");
  let zElement = document.getElementById("z");
  // Function to handle the button click
  button.addEventListener("click", function () {
    // Check if the accelerometer is supported by the browser
    if (window.DeviceMotionEvent) {
      // Ask the user for permission to access the accelerometer
      if (
        window.confirm(
          "Allow access to the accelerometer? You can deny access at any time in your browser settings."
        )
      ) {
        // Add event listener for device motion
        window.addEventListener("devicemotion", accelerometerUpdate, true);
        // Change the text of the button to show that access has been granted
        button.textContent = "YES";
        button.className = "yes";
      } else {
        // If the user does not allow access, change the text of the button and remove the event listener
        button.textContent = "NO";
        button.className = "no";
        window.removeEventListener("devicemotion", accelerometerUpdate, true);
      }
    } else {
      console.log("Accelerometer not supported on this browser/device");
    }
  });
});

// Function to handle the device motion event
function accelerometerUpdate(event) {
  // Get the acceleration values
  let aX = event.accelerationIncludingGravity.x * 10;
  let aY = event.accelerationIncludingGravity.y * 10;
  let aZ = event.accelerationIncludingGravity.z * 10;
  // Update the elements with the new values
  xElement.value = aX;
  yElement.value = aY;
  zElement.value = aZ;
  // If the Y value is negative, switch the X value's sign and subtract 180 to adjust for the rotation
  if (aY < 0) {
    aX = -aX - 180;
  }
  // Rotate the #block element based on the X value
  document.querySelector("#block").style.transform = "rotate(" + aX + "deg)";
}
