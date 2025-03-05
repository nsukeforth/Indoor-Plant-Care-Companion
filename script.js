function sendMessage() {
    console.log("sendMessage() function triggered");

    const input = document.getElementById("user-input").value;
    if (input.trim() === "") {
        console.log("Empty input, skipping response");
        return;
    }

    // Display user message
    const chatBox = document.getElementById("chat-box");
    const userMessage = document.createElement("div");
    userMessage.textContent = "You: " + input;
    chatBox.appendChild(userMessage);

    // Get chatbot response (without fetching from a server)
    const response = getResponse(input);
    console.log("Response generated:", response);

    const botMessage = document.createElement("div");
    botMessage.textContent = "Bot: " + response;
    botMessage.style.color = "green"; // Bot responses are visually distinct
    chatBox.appendChild(botMessage);

    // Clear input field
    document.getElementById("user-input").value = "";
}

// Simple response function (no API needed)
function getResponse(input) {
    console.log("getResponse() function triggered with input:", input);

    if (input.toLowerCase().includes("hello")) {
        return "Hello! How can I help you with your plants?";
    } else if (input.toLowerCase().includes("water")) {
        return "Most plants need watering once a week, but it depends on the species!";
    } else {
        return "I'm not sure, but I'm learning! Try asking about plant care.";
    }
}
