function capitalizeFirstLetter(text) {
  if (!text) return '';
  return text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatCpfCnpj(value) {
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length === 11) {
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (cleanValue.length === 14) {
    return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  } else {
    return value;
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "extractData") {
    console.log("Ação 'extractData' recebida no content script.");

    const pessoaFisicaElement = document.querySelector('#p0-SRV_PESSOAFISICA-0 .form-group.single p.form-control-static');

    if (pessoaFisicaElement) {
      try {
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        pessoaFisicaElement.dispatchEvent(event); 
        console.log("Elemento clicado:", pessoaFisicaElement.textContent);
        setTimeout(() => {
          console.log("Time");
        }, 2000);
      } catch (error) {
        console.error("Erro ao tentar clicar no elemento:", error);
      }
    } else {
      console.warn("Elemento com a classe 'form-control-static' não encontrado.");
    }

    setTimeout(function() {
      const mainElement = document.getElementById('ul-tab-det-content-p0-SRV_CONDUTORES-0');
      const documentoElement = document.getElementById('tab-p0-SRV_CONDUTORES-0-documentoCondutor');
      const carElement = document.getElementById('p0-SRV_VEICULOS-lista');
      const novoElement = document.getElementById('p0-SRV_PESSOAFISICA-0-detalhe');
      const novoElement1 = document.getElementById('tab-p0-SRV_CONDUTORES-0-detalhesCondutor');

      if (mainElement || documentoElement || carElement || novoElement) {
        console.log("Elementos principais encontrados.");
  
        function getTextByLabel(element, labelText) {
          if (!element) {
            console.warn(`Elemento não encontrado para a label ${labelText}`);
            return ''; 
          }
  
          const labelElement = Array.from(element.querySelectorAll('label'))
            .find(label => label.textContent.trim().toLowerCase() === labelText.toLowerCase());

          return labelElement && labelElement.nextElementSibling 
            ? labelElement.nextElementSibling.textContent.trim() 
            : '';
        }

        const textoPessoaFisica = pessoaFisicaElement.textContent.trim();
        const endereco1 = getTextByLabel(novoElement1, 'Endereço');
        const endereco2 = getTextByLabel(novoElement, 'Endereço');
        function extractNumbers(text) {
            return text.replace(/\D/g, '');
        }
        const pessoaInfo = {
          NNNN: capitalizeFirstLetter(textoPessoaFisica),
          MMM: capitalizeFirstLetter(getTextByLabel(novoElement, 'Filiação 1')),
          CCC: formatCpfCnpj(getTextByLabel(novoElement, 'CPF')),
          D8N: getTextByLabel(mainElement, 'D. N.'),
          PPP: capitalizeFirstLetter(getTextByLabel(mainElement, 'Filiação 2')),
          SSSS: capitalizeFirstLetter(getTextByLabel(novoElement, 'Sexo')),
          N8C: capitalizeFirstLetter(getTextByLabel(mainElement, 'Nacionalidade')),
          N8D: endereco1 ? capitalizeFirstLetter(endereco1) : capitalizeFirstLetter(endereco2),
          N7D8: endereco1 ? capitalizeFirstLetter(endereco2) : "",
          R8R: extractNumbers(capitalizeFirstLetter(getTextByLabel(documentoElement, 'Documento'))),
          O8E: getTextByLabel(documentoElement, 'Órgão Emissor/UF'),
        };

        console.log("Dados extraídos:", pessoaInfo);
        function formatVeiculos(veiculosText) {
          if (!veiculosText) return "";
          const dados = veiculosText.startsWith('-') ? veiculosText.substring(1).split('--') : veiculosText.split('--');
          const veiculos = [];
          for (let i = 0; i < dados.length; i += 7) {
              if (i + 6 >= dados.length) break;
              const placa = dados[i].trim();
              const [marca, ...modeloArray] = dados[i + 2].trim().split('/');
              const marcaFormatada = marca.charAt(0).toUpperCase() + marca.slice(1).toLowerCase();
              const modeloFormatado = modeloArray.join(' ')
                  .toLowerCase()
                  .replace(/\b\w/g, char => char.toUpperCase());
              const cor = dados[i + 3].trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
              const ano = dados[i + 4].trim();
              veiculos.push(`${placa} / ${marcaFormatada} ${modeloFormatado} ${cor} ${ano}`);
          }
          return veiculos.join('; ');
        }

        const veiculosText = carElement ? carElement.innerText.replace(/\n/g, '-').substring(109) : '';
        console.log("Texto de veículos extraído:", formatVeiculos(veiculosText));

        let imageBase64 = '';
        if (mainElement) {
          const imageElement = mainElement.querySelector('.sinesp-photo-container img');
          if (imageElement) {
            imageBase64 = imageElement.src.split(",")[1];
          }
        }

        console.log("Imagem base64 extraída:", imageBase64);

        const txtContent = `NNNN: ${pessoaInfo.NNNN}\nMMM: ${pessoaInfo.MMM}\nCCC: ${pessoaInfo.CCC}\nD8N: ${pessoaInfo.D8N}\nPPP: ${pessoaInfo.PPP}\nSSSS: ${pessoaInfo.SSSS}\nN8C: ${pessoaInfo.N8C}\nN8D: ${pessoaInfo.N8D}\nN7D8: ${pessoaInfo.N7D8}\nR8R: ${pessoaInfo.R8R}\nO8E: ${pessoaInfo.O8E}\nV8I: ${formatVeiculos(veiculosText)}\nImagem: ${imageBase64}`;

        chrome.runtime.sendMessage({ action: 'saveData', filename: pessoaInfo.NNNN ? `${pessoaInfo.NNNN}.txt` : 'dados_extracao.txt', data: txtContent, image: imageBase64 }, function(response) {
          console.log("Dados enviados para o background script.");
        });

      } else {
        console.log("Nenhum dos elementos principais foi encontrado.");
      }
    }, 500);
  }
});
