document.addEventListener("DOMContentLoaded", () => {
    const enviarBtn = document.getElementById("enviar");
    const duvidaInput = document.getElementById("duvida");
    const chatBox = document.getElementById("chatBox");
    const gerarPdfBtn = document.getElementById("gerarPdf"); // A variável agora está declarada no escopo correto

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
        const element = document.getElementById('chatBox'); // O elemento que você quer converter para PDF

        // Verifica se o chatBox tem conteúdo antes de gerar o PDF
        if (element.children.length === 0) {
            alert("Não há conversas para gerar o PDF. Inicie um chat primeiro!");
            return;
        }

        // SALVE AS POSIÇÕES DE SCROLL ATUAIS PARA RESTAURAR DEPOIS
        const scrollTop = element.scrollTop;
        const scrollLeft = element.scrollLeft;

        // Temporariamente ajuste o scroll para o topo para garantir que html2canvas comece de cima
        element.scrollTop = 0;
        element.scrollLeft = 0;

        // Opções para a geração do PDF
        const options = {
            margin: 1,
            filename: 'conversa_bible_chat.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2, // Aumenta a resolução da captura para melhor qualidade
                logging: true, // Para depuração, mostra logs no console
                useCORS: true, // Importante se houver imagens de outras origens
                // As seguintes opções podem ajudar a capturar todo o conteúdo
                width: element.scrollWidth, // Largura total do conteúdo
                height: element.scrollHeight // Altura total do conteúdo rolável
            },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Usa html2pdf
        html2pdf().from(element).set(options).save().then(() => {
            // RESTAURE AS POSIÇÕES DE SCROLL APÓS A GERAÇÃO DO PDF
            element.scrollTop = scrollTop;
            element.scrollLeft = scrollLeft;
        });
    });
}); 
