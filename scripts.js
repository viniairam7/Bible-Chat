document.addEventListener("DOMContentLoaded", () => {
    const enviarBtn = document.getElementById("enviar");
    const duvidaInput = document.getElementById("duvida");
    const chatBox = document.getElementById("chatBox");

    function adicionarMensagem(texto, tipo) {
        const mensagemDiv = document.createElement("div");
        mensagemDiv.classList.add("mensagem", tipo); // tipo: 'user' ou 'bot'
        mensagemDiv.innerText = texto;
        chatBox.appendChild(mensagemDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    enviarBtn.addEventListener("click", async () => {
        const pergunta = duvidaInput.value.trim();
        if (pergunta === "") {
            adicionarMensagem("Por favor, digite uma dúvida.", "bot");
            return;
        }

        adicionarMensagem(pergunta, "user");
        duvidaInput.value = "";

        const digitandoEl = document.createElement("div");
        digitandoEl.classList.add("mensagem", "bot");
        digitandoEl.innerText = "Digitando...";
        chatBox.appendChild(digitandoEl);

        try {
            const response = await fetch("https://bible-chat-9.onrender.com/perguntar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pergunta })
            });

            const data = await response.json();

            // Remove o "Digitando..."
            chatBox.removeChild(digitandoEl);

            adicionarMensagem(data.resposta || "Sem resposta recebida.", "bot");

        } catch (error) {
            chatBox.removeChild(digitandoEl);
            adicionarMensagem("Erro ao buscar resposta.", "bot");
            console.error("Erro:", error);
        }
    });
});
