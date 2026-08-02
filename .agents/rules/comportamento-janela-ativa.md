---
trigger: always_on
---

Após analisar as especificações do widget acima, você deve projetar o CSS e a estrutura do layout aplicando as seguintes regras de 'Janela Nativa' (estilo Windows/macOS). Você tem autonomia para analisar os componentes solicitados e identificar onde aplicar cada regra:
1. Bloqueio do Contêiner Principal: O contêiner raiz (pai de todos) que envolve este widget DEVE ser estritamente rígido, ocupando 100% do espaço disponível (ex: height: 100%; display: flex;). É terminantemente proibido que o contêiner principal permita rolagem. Você DEVE aplicar overflow: hidden; nele para evitar a criação de scrolls genéricos na página.
2. Discernimento de Componentes Internos (Scroll Independente): Analise todos os componentes internos que você vai criar para este widget e divida-os em duas categorias:
Elementos Estáticos: (Ex: cabeçalhos, rodapés, barras de título, menus de navegação simples). Estes devem ter tamanhos definidos e não devem rolar.
Áreas de Conteúdo Denso: (Ex: listas, tabelas, corpos de texto, formulários longos, grades de itens). Para cada uma destas áreas que você identificar, você DEVE envolvê-las em seu próprio contêiner flexível (ex: flex: 1;) e aplicar OBRIGATORIAMENTE a regra overflow-y: auto; (ou overflow-x: auto; se for horizontal).
3. Objetivo Final: Seu código final deve garantir que, se o widget for redimensionado para um tamanho muito pequeno, a estrutura de fora se mantenha intacta (sem vazar pela tela) e apenas as 'Áreas de Conteúdo Denso' que você identificou criem suas próprias barras de rolagem de forma independente e dinâmica."