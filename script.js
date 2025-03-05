function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<p><b>You:</b> ${userInput}</p>`;

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        chatBox.innerHTML += `<p><b>Bot:</b> ${data.response}</p>`;
        document.getElementById("user-input").value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

