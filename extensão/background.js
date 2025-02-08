chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'saveData') {
    const data = request.data;
    const filename = request.filename || 'dados_extracao.txt';

    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    sendResponse({ status: 'success' });
  }
});
