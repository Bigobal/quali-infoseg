# Códigos necessários para a utilização da extensão de extração dos dados do Infoseg, a pasta "extensão" deve ser baixada por completo e colocada em algum diretório do computador, posteriormente, ela deve ser importada nas extensões do navegador, é necessário habilitar as configurações de desenvolvedor, e importar a pasta por completo. Feito isso, a extensão será disponível no navegador.

# A extensão possui um botão que ao ser clicado, baixa um txt com os dados da pessoa que se deseja qualificar.

# Por fim, basta abrir o quali-infose.exe e procurar pelo arquivo txt baixado recentemente, lembrando que o documento "qualificação geral.docx" deve estar na mesma pasta que o executável pois ele irá gerar um arquivo auxiliar "qualificação_geral_modificado.docx" com os dados obtidos da extração.

# Caso seja o primeiro uso, é necessário gerar o executável "quali-infose.exe". Para isso, abra o prompt de comando na pasta que o arquivo "quali-infose.py" está presente e rode o comando: pyinstaller --onefile --noconsole "quali-infoseg.py" . Lembrando que é necessário ter o python instalado na máquina, bem como a biblioteca pyinstaller.
