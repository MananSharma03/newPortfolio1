document.addEventListener("DOMContentLoaded", function () {
    const chatbotIcon = document.getElementById("chatbot-icon");
    const chatbotWindow = document.getElementById("chatbot-window");
    const chatbotClose = document.getElementById("chatbot-close");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const messagesContainer = document.getElementById("chatbot-messages");

    const API_KEY = "YOUR_GROQ_API_KEY";  // Replace with your actual API key
    const API_URL = "https://api.groq.com/v1/chat/completions"; // Corrected API endpoint

    chatbotIcon.addEventListener("click", () => {
        chatbotWindow.classList.toggle("active");
    });

    chatbotClose.addEventListener("click", () => {
        chatbotWindow.classList.remove("active");
    });

    sendBtn.addEventListener("click", () => {
        sendMessage();
    });

    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        addMessage(message, "user");

        userInput.value = "";
        userInput.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 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"
                },
                body: JSON.stringify({
                    model: "mixtral-8x7b",  // Use a valid Groq model name
                    messages: [{ role: "user", content: message }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const botReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand.";

            addMessage(botReply, "bot");
        } catch (error) {
            console.error("Chatbot Error:", error);
            addMessage("Error connecting to chatbot. Please try again later.", "bot");
        } finally {
            userInput.disabled = false;
            userInput.focus();
        }
    }

    function addMessage(text, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender === "user" ? "user-message" : "bot-message");
        messageElement.textContent = text;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});
