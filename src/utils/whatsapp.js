export function gerarLinkWhatsApp({ telefone, nome, servico, hora, data }) {
  const numero = telefone.replace(/\D/g, "");
  const dataFormatada = new Date(data + "T00:00:00").toLocaleDateString(
    "pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
    },
  );

  const mensagem =
    `Olá ${nome}! 💅 Lembrando do seu agendamento:\n\n` +
    `📅 ${dataFormatada}\n` +
    `⏰ ${hora}\n` +
    `✨ Serviço: ${servico}\n\n` +
    `Qualquer dúvida, é só chamar! 😊`;

  return `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
}
