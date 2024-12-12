document.getElementById('extractData').addEventListener('click', function() {
  console.log("Botão 'Extrair Dados' clicado.");
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "extractData"}, function(response) {
      console.log("Mensagem enviada para a aba ativa.");
    });
  });
});
