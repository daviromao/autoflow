# Simulador dos Sensores

A criação de um sistema que trabalha com dispositivos IoT nem sempre é fácil, trabalhar diretamente com um dispositivo físico pode enfrentar barreiras das mais diversas possíveis. Por isso, uma solução viável para validação do seu sistema é trabalhar com sensores virtualmente.

A estratégia de trabalhar com componentes virtuais nos trás o benefício de avaliar como estes respondem antes mesmo de ter a necessidade de dispositivos reais, com a capacidade de avaliar diversos cenários possíveis - inclusive críticos - que nem sempre são simples de realizar. Além disso, não há custo para sua significativo e diminui o tempo necessário para obtenção dos mesmo.

O objetivo desta parte do projeto é criar dispositivos que possam simular dados sobre um cruzamento de transito, sendo eles: quantidade de carros, tipos de carros, quantidade de pedestres, automação e temporização dos semáforos.

Os seguintes dipositovos estão listados:

- **Semáforos:** que recebem sinais do sistema controlador via interscity;
- **Câmeras:** identifica a quantidade e os tipos de carros em uma determinada rua.

## Como Rodar?
<!-- Yarn e Nodejs -->
Para rodar o projeto é necessário ter o [Nodejs](https://nodejs.org/en/) e o [Yarn](https://yarnpkg.com/) instalados. Após isso, basta rodar os seguintes comandos:

```bash
# Instalar as dependências
yarn install
````

```bash
# Criar uma única vez os sensores na interscity
yarn setup:simulator
````

```bash
# Rodar os sensores
yarn start
```

Após isso, os sensores estarão rodando e enviando dados para a interscity.
Também é possível receber os comandos enviados pela interscity.

Caso queira alterar o estado dos sensores, basta enviar uma requisição http para o endereço `http://10.10.10.104:8000/actuator/commands` com o seguinte corpo:

```json
{
  "data": [
    {
      "uuid": "f9ef6bd8-18db-4adf-b227-996e85c6c728",
      "capabilities": {
        "semaphore": "green"
      }
    }
  ]
}
```

