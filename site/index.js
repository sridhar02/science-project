document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("password") === "1234") {
    hideLoginSection();
    document.getElementById("cameraSection").style.display = "block";
  }
});

document.getElementById("loginButton").addEventListener("click", function () {
  var password = document.getElementById("passwordInput").value;
  if (password === "1234") {
    localStorage.setItem("password", password);
    hideLoginSection();
    document.getElementById("cameraSection").style.display = "block";
  } else {
    alert("Incorrect Password!");
  }
});

function hideLoginSection() {
  document.getElementById("loginSection").style.display = "none";
}

document.getElementById("sendButton").addEventListener("click", function () {
  const input = document.getElementById("avatar");

  const file = input.files[0];
  console.log(file);

  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    // This is the file content
    console.log({ event });
    const fileContent = event.target.result;
    console.log(fileContent);
    sendImageToAPI(new Blob([fileContent]));
  };
  fileReader.onerror = function () {
    console.error("There was an error reading the file!");
  };
  fileReader.readAsArrayBuffer(file); // Replace with readAsDataURL(file) or readAsArrayBuffer(file) as needed
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
