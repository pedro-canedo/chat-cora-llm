# Instruções para Construção e Execução da Aplicação

1. Certifique-se de que o Docker está instalado e em execução.

2. Torne o script `build-app.sh` executável:

```
chmod +x build-app.sh
```


O script irá:
- Verificar se o Docker está em execução e tentar iniciá-lo se necessário.
- Verificar se as portas necessárias estão livres e solicitar a liberação se estiverem ocupadas.
- Atualizar o arquivo `nginx.conf` no diretório `frontend`.
- Construir e iniciar os serviços definidos no `docker-compose.yml`.
- Exibir a lista de containers em execução após a conclusão.

Se houver problemas durante a execução, o script fornecerá mensagens detalhadas para ajudar na resolução.


