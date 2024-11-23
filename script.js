const socket = io("http://localhost:8000");
const form = document.getElementById("chat-input");
const message = document.getElementById("message");
const messageContainer = document.querySelector(".chat-messages");

// audio for message
let audio = new Audio("./assets/message.mp3");
// Prompt user for their name
let user = null;

while (!user || user.trim() === "") {
  user = prompt("Enter your name to join the Chat:");
  if (!user || user.trim() === "") {
    alert("A username is required to join the chat.");
  }
}

// Listen for confirmation from the server
socket.on("user_joined", (name) => {
  alert(`${name} has joined the chat.`);
  audio.play();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!message.value.trim()) return;

  console.log("send clicked");
  socket.emit("send", message.value);

  // Create a div for the sender's message
  let div = document.createElement("div");
  let messageP = document.createElement("p");
  let senderP = document.createElement("p");
  let span = document.createElement("span");

  // Add content
  senderP.textContent = "You"; // Label as "You" for the sender
  messageP.textContent = message.value;
  span.textContent = new Date().toLocaleTimeString();

  // Add classes
  div.classList.add("message", "sent");
  senderP.classList.add("sender-label");
  messageP.classList.add("message-text");

  // Append elements
  div.appendChild(senderP);
  div.appendChild(messageP);
  div.appendChild(span);
  messageContainer.appendChild(div);

  // Clear the input field
  message.value = "";
});

socket.on("receive", (data) => {
  audio.play();
  // Create a div for the received message
  let div = document.createElement("div");
  let messageP = document.createElement("p");
  let senderP = document.createElement("p");
  let span = document.createElement("span");

  // Add content
  senderP.textContent = data.name; // Display sender's name
  messageP.textContent = data.message;
  span.textContent = new Date().toLocaleTimeString();

  // Add classes
  div.classList.add("message", "received");
  senderP.classList.add("sender-label");
  messageP.classList.add("message-text");

  // Append elements
  div.appendChild(senderP);
  div.appendChild(messageP);
  div.appendChild(span);
  messageContainer.appendChild(div);
});

socket.on("user_left", (user) => {
  audio.play();
  alert(`${user} is offline from the chat.`);
});
