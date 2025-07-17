document.addEventListener("DOMContentLoaded", () => {
    const enviarBtn = document.getElementById("enviar");
    const duvidaInput = document.getElementById("duvida");
    const chatBox = document.getElementById("chatBox");
    const gerarPdfBtn = document.getElementById("gerarPdf");

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
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch("https://bible-chat-11.onrender.com/perguntar", {
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

   // Listener para o botão de gerar PDF
   gerarPdfBtn.addEventListener("click", () => {
        const element = document.getElementById('chatBox'); 

        // Verifica se o chatBox tem conteúdo antes de gerar o PDF
        if (element.children.length === 0) {
            alert("Não há conversas para gerar o PDF. Inicie um chat primeiro!");
            return;
        }

        // Inicializa jsPDF
        const doc = new jsPDF();
        let yPos = 10; // Posição Y inicial para o texto

        doc.setFontSize(12);
        doc.text("Conversa do Bible Chat", 10, yPos); // Título
        yPos += 10;

        // Itera sobre as mensagens no chatBox
        const mensagens = element.querySelectorAll('.mensagem');
        mensagens.forEach(mensagem => {
            const tipo = mensagem.classList.contains('user') ? 'Você: ' : 'Bot: ';
            const texto = tipo + mensagem.innerText;

            // Divide o texto em linhas para caber na largura da página
            const splitText = doc.splitTextToSize(texto, 180); // 180 é a largura máxima da linha

            // Adiciona cada linha do texto
            splitText.forEach(line => {
                if (yPos > 280) { // Se a posição Y exceder o limite da página, adicione uma nova página
                    doc.addPage();
                    yPos = 10; // Reinicia a posição Y na nova página
                }
                doc.text(line, 10, yPos);
                yPos += 7; // Incrementa a posição Y para a próxima linha
            });
            yPos += 5; // Espaço extra entre as mensagens
        });

        // Salva o PDF
        doc.save('conversa_bible_chat.pdf');
    });
});
