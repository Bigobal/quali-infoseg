chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'saveData') {
    const data = request.data;

    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dados_extracao.txt';
    a.click();
    URL.revokeObjectURL(url);

    sendResponse({ status: 'success' });
  }
});
