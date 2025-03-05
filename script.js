function sendMessage() {
  const input = document.getElementById("user-input").value;
  if (input.trim() === "") return;
  
  // Display the user's message
  const chatBox = document.getElementById("chat-box");
  const messageElem = document.createElement("div");
  messageElem.textContent = input;
  chatBox.appendChild(messageElem);
  
  // Process the message and get a response
  const response = getResponse(input);
  const responseElem = document.createElement("div");
  responseElem.textContent = response;
  chatBox.appendChild(responseElem);
  
  // Clear the input field
  document.getElementById("user-input").value = "";
}

// Dummy function for response
function getResponse(input) {
  // Replace this with your actual logic or API call
  return "You asked: " + input;
}
