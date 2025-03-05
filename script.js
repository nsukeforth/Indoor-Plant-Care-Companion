function sendMessage() {
    console.log("sendMessage() function triggered"); // Check if this function is called

    const input = document.getElementById("user-input").value;
    if (input.trim() === "") {
        console.log("Empty input, skipping response");
        return;
    }

    // Display user's message
    const chatBox = document.getElementById("chat-box");
    const messageElem = document.createElement("div");
    messageElem.textContent = "You: " + input;
    chatBox.appendChild(messageElem);

    // Process the message and get a response
    const response = getResponse(input);
    console.log("Response received:", response); // Debugging step

    const responseElem = document.createElement("div");
    responseElem.textContent = "Bot: " + response;
    chatBox.appendChild(responseElem);

    // Clear the input field
    document.getElementById("user-input").value = "";
}
