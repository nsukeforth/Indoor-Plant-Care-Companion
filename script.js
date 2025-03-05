
// Function to handle sending messages
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

    // Get chatbot response from plant data
    const response = getResponse(input);
    console.log("Response generated:", response);

    const botMessage = document.createElement("div");
    botMessage.textContent = "Bot: " + response;
    botMessage.style.color = "green"; // Bot responses are visually distinct
    chatBox.appendChild(botMessage);

    // Clear input field
    document.getElementById("user-input").value = "";
}

// Function to retrieve a response from plantData.js
function getResponse(input) {
    console.log("getResponse() function triggered with input:", input);

    const lowerInput = input.toLowerCase();

    // Search for the most relevant plant care information
    for (let i = 0; i < plantData.length; i++) {
        const entry = plantData[i];
        if (lowerInput.includes(entry.Question.toLowerCase())) {
            return entry.Answer;
        }
    }

    return "I'm sorry, I don't have information on that plant yet. Try asking about a different plant!";
}
