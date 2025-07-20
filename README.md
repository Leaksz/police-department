# Etapa 2: API para o Departamento de Polícia

## 🧩 Contexto

A Polícia está modernizando seus sistemas e criou um novo serviço digital para rastrear **casos e agentes da corporação**. 

Você foi convocado para desenvolver a **primeira versão da API REST**, que permitirá aos investigadores cadastrar, consultar e atualizar informações — tudo operando em um servidor **Node.js com Express**.

---

## 🎯 Objetivo

Construir uma **API RESTful** que permita o gerenciamento de **agentes e casos policiais fictícios**, com validações, tratamento de erros e dados armazenados **em memória** (utilizando arrays).

--- 

## Como Iniciar o Servidor

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local.

**1. Crie o projeto seguindo a estrutura**

Clone o repositório e execute o seguinte comando: 

```npm init -y```

Depois, crie os repositórios e arquivos e diretórios seguindo a estrutura de exemplo (está descrita abaixo).

**2. Instale as Dependências**

Navegue até o diretório raiz do projeto pelo terminal e instale o Express.js:

```bash
npm install express
```
Se você estiver recebendo os dados do formulário via POST, precisará de um middleware para interpretar o corpo da requisição. O Express já inclui o express.urlencoded.

**Observação:** Nessa etapa, além das dependências necessárias, você está livre para usar as que preferir

**3. Crie o servidor**

Insira este código no arquivo server.js

```javascript
const express = require('express')
const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});
```

**4. Inicie o Servidor**

Execute o seguinte comando no terminal:

```bash
npm start
```

O servidor será iniciado, e você deverá ver uma mensagem no console, por exemplo:

Servidor do Departamento de Polícia rodando em http://localhost:3000


## 💡 Orientações Gerais para a atividade
### Controladores
Nessa etapa vamos modularizar nosso código e utilizar os controladores para servir as rotas. Os dois arquivos de controladores devem receber os nomes `agentesController.js` e `casosController.js` e devem residir na pasta `/controllers` 
Um exemplo de como um controller deve se parecer:
```javascript
const casosRepository = require("../repositories/casosRepository")
function getAllCasos(req, res) {

        const casos = casosRepository.findAll()
        res.json(casos)
}

module.exports = {
   getAllCasos
}
```
### Rotas
As rotas nessa etapa devem ser definidas nos arquivos `agentesRoutes.js` e `casosRoutes.js` que por sua vez deve estar dentro da pasta `/routes`, porém dessa vez utilizaremos o Router do express, segue um exemplo de como utilizá-lo para definir uma rota GET no `agentesRoutes.js`:
```javascript
const express = require('express')
const router = express.Router();
const agentesController = require('../controllers/agentesController');

// define a rota para /agentes usando o método GET
router.get('/agentes', agentesController.seuMetodo)

module.exports = router
```
Agora adicionaremos o `agentesRouter` como middleware no arquivo principal da aplicação:

```javascript
//server.js 

const express = require('express');
const app = express();
const agentesRouter = require("./routes/agentesRouter")

app.use(agentesRouter);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT} em modo de desenvolvimento`);
}); 
 ```
 Pronto! Agora é só implementar as demais rotas da sua aplicação!


## Repositories
Os repositories são a nossa camada de *Data-Acess* e devem estar em uma pasta chamada `/repositories`. Serão nesses arquivos que você deverá definir o *array* para cada recurso para simularmos a persistência de dados nessa etapa. Os arquivos `casosRepository.js`e `agentesRepository.js`devem ser responsáveis **apenas** por manipular os dados do array, adicionando, removendo, buscando e atualizando objetos.
Um exemplo de como um repository deve se parecer:
```javascript
const casos = [
    {
        id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
        titulo: "homicidio",
        descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: "aberto",
        agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1" 
    
    },
    //Demais objetos
]

function findAll() {
    return casos
}
module.exports = {
    findAll
}

```



**route** --> **controller** --> **repository**

## Utils (opcional)
Nessa pasta você pode inserir funções para tratamento de erros e demais utility functions que preferir

### Teste da API 
Recomendamos que você teste a sua API com as ferramentas *Postman* e *Insomnia*. Ambos simulam um cliente e mandam requisições para sua aplicação de maneira que testá-la se torne uma atividade mais visual e simples. Seguem links úteis para a instalação e utilização de ambos
- Site oficial do Postman: https://www.postman.com/
- Site oficial do Insomnia: https://insomnia.rest/
 
---
# 📁  Estrutura dos Diretórios (pastas) 
```
📦 SEU-REPOSITÓRIO
│
├── package.json
├── server.js
├── .env (opcional para centralizar configurações)
│
├── routes/
│ ├── agentesRoutes.js
│ └── casosRoutes.js
│
├── controllers/
│ ├── agentesController.js
│ └── casosController.js
│
├── repositories/
│ ├── agentesRepository.js
│ └── casosRepository.js
│
│
├── docs/
│ └── swagger.js
│
├── utils/
│ └── errorHandler.js
│

  
```
- Não delete a pasta `.github, é por lá que o **Autograder** reside.
---
# 📙 Recurso de casos policiais: `/casos`

Gerencia os **registros de crimes nos arquivos do departamento de polícia**.

### Métodos HTTP que deverão ser implementados:
- `GET /casos` → Lista todos os casos registrados. 
- `GET /casos/:id` → Retorna os detalhes de um caso específico.
- `POST /casos` → Cria um novo caso com os seguintes campos:
- `PUT /casos/:id` → Atualiza os dados de um caso por completo.
- `PATCH /casos/:id` → Atualiza os dados de um caso parcialmente.
- `DELETE /casos/:id` → Remove um caso do sistema.


### Estrutura de um caso:
  - `id`: string (UUID) **obrigatório**.
  - `titulo`: string **obrigatório**.
  - `descricao`: string **obrigatório**.
  - `status`: deve ser `"aberto"` ou `"solucionado"` **obrigatório**.
  - `agente_id`: string (UUID), id do agente responsável **obrigatório**
Exemplo:
```

{
    "id": "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
    "titulo": "homicidio",
    "descricao": "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
    "status": "aberto",
    "agente_id": "401bccf5-cf9e-489d-8412-446cd169a0f1" 

}

```

### Regras e Validações:

- `status` deve ser `"aberto"` ou `"solucionado"`.
- IDs inexistentes devem retornar status **404**.
- Dados mal formatados devem retornar status **400**.
- Status HTTP esperados: **201**, **200**, **204**, **400**, **404**.


## Bônus 🌟

### Endpoints
- `GET /casos?agente_id=uuid` → Lista todos os casos atribuídos à um agente específico.
- `GET /casos/:caso_id/agente` → Retorna os dados completos do agente responsável por um caso específico.
- `GET /casos?status=aberto` → Lista todos os casos em aberto.
 - `GET /casos/search?q=homicídio` → Deve retornar todos os casos em que a palavra da query string aparece no **titulo** e/ou **descricao**, ou seja, uma pesquisa full-text


### Corpo de Resposta de Erro (Response Body)
Ganhe pontuação bônus por implementar um corpo de resposta personalizado para um payload com argumentos inválidos! O JSON abaixo exemplifica um corpo de resposta para uma requisição em que o campo `status` é inválido.
```json
{
  "status": 400,
  "message": "Parâmetros inválidos"
  "errors": [
    "status": "O campo 'status' pode ser somente 'aberto' ou 'solucionado' "
  ]
}

```

# 📙 Recurso de agentes policiais: `/agentes`

Gerencia os **agentes da polícia**.

### Métodos HTTP que deverão ser implementados::

- `GET /agentes` → Lista todos os agentes.
- `GET /agentes/:id` → Retorna um agente específico.
- `POST /agentes` → Cadastra um novo agente com:
- `PUT /agentes/:id` → Atualiza os dados do agente por completo.
- `PATCH /agentes/:id` → Atualiza os dados do agente parcialmente.
- `DELETE /agentes/:id` → Remove o agente.


#### Estrutura de um agente:
  - `id`: string (UUID) **obrigatório**.
  - `nome`: string **obrigatório**.
  - `dataDeIncorporacao`: string , no formato `YYYY-MM-DD`**obrigatória**.
  - `cargo`: ("inspetor", "delegado", etc.) **obrigatório**.

Exemplo:
  ```

{
    "id": "401bccf5-cf9e-489d-8412-446cd169a0f1",
    "nome": "Rommel Carneiro",
    "dataDeIncorporacao": "1992/10/04",
    "cargo": "delegado"

}

```

### Regras e Validações:

- IDs inválidos devem retornar status **404**.
- Dados mal formatados devem retornar status **400**.
- IDs inexistentes devem retornar status **404**.
- Status HTTP esperados: **201**, **200**, **204**, **400**, **404**.

##  Bônus 🌟
### Endpoints
- `GET /agentes?cargo=inspetor` → Lista todos os agentes baseado no cargo ("inspetor" ou "delegado").
- `GET /agentes?sort=dataDeIncorporacao` ou `sort=-dataDeIncorporacao` → Lista os agentes em ordem crescente ou decrescente de data incorporação 

`sort=dataDeIncorporacao` → ordem crescente (mais antigo primeiro)

`sort=-dataDeIncorporacao` → ordem decrescente (mais recente primeiro)

### Corpo de Resposta de Erro (Response Body)
Ganhe pontuação bônus por implementar um corpo de resposta personalizado para um payload com argumentos inválidos! O JSON abaixo exemplifica um corpo de resposta para uma requisição em que o campo `dataDeIncorporacao` não seguiu a formatação adequada.
```json
{
  "status": 400,
  "message": "Parâmetros inválidos"
  "errors": [
    "dataDeIncorporacao": "Campo dataDeIncorporacao deve seguir a formatação 'YYYY-MM-DD' "
  ]
}

```


---
# 📝 Orientações gerais para respostas
### Requisições GET
- As requisições do tipo `GET` devem retornar o status code **200 OK✅** e o objeto ou array de objetos do recurso.
### Requisições POST, PUT e PATCH
- As requisições do tipo `PUT` e `PATCH` devem retornar o status code **200 OK✅** e o objeto atualizado!
- As requisições do tipo `POST` devem retornar o status code **201 CREATED✅** e o objeto criado!
### Requisições DELETE
- As requisições do tipo `DELETE`devem retornar o status code **204 NO CONTENT✅** e não devem possuir corpo de resposta.

---
# 📃 Documentação da API com o Swagger e padrão OAS (OpenAPI Specification)
- Você deve documentar a API que criou seguindo os padrões OAS e utilizando a ferramenta *Swagger*. Isso será feito dentro da própria aplicação com a ajuda das bibliotecas `swagger-jsdoc`e `swagger-ui-express`. **Sua documentação deve estar disponível no endpoint `/docs`** . 
- Sua documentação deve seguir o padrão OAS, o qual o *Swagger* tem suporte nativo
- Fique à vontade para escolher entre um documento de definição em formato **JSON** ou **YAML**.
- Teremos um Hands-On sobre como utilizar a ferramenta.

---
### Desejamos êxito a todos nesta etapa e que todos tenham resultados à altura do desafio. 🎯
