document.addEventListener("DOMContentLoaded", () => {
    const enviarBtn = document.getElementById("enviar");
    const duvidaInput = document.getElementById("duvida");
    const chatBox = document.getElementById("chatBox");

    function adicionarMensagem(texto, tipo) {
        const mensagemDiv = document.createElement("div");
        mensagemDiv.classList.add("mensagem", tipo); // tipo: 'usuario' ou 'bot'
        mensagemDiv.innerText = texto;
        chatBox.appendChild(mensagemDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // rolar para a última mensagem
    }

    enviarBtn.addEventListener("click", async () => {
        const pergunta = duvidaInput.value.trim();
        if (pergunta === "") {
            adicionarMensagem("Por favor, digite uma dúvida.", "bot");
            return;
        }

        adicionarMensagem(pergunta, "usuario");
        duvidaInput.value = "";
        adicionarMensagem("Digitando...", "bot");

        try {
            const response = await fetch("https://bible-chat-9.onrender.com/pergunta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pergunta })
            });

            const data = await response.json();

            // Remove o "Pensando..."
            const pensando = chatBox.querySelector(".bot:last-child");
            if (pensando && pensando.innerText === "Digitando...") {
                chatBox.removeChild(pensando);
            }

            adicionarMensagem(data.resposta || "Sem resposta recebida.", "bot");

        } catch (error) {
            adicionarMensagem("Erro ao buscar resposta.", "bot");
            console.error("Erro:", error);
        }
    });
});