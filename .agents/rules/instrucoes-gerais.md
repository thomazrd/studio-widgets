---
trigger: always_on
---

O repositório deste projeto contém um conjunto de widgets independentes. O padrão obrigatório de organização de pastas é o seguinte:
<NOME_DO_WIDGET>/ 
├─ readme.md (Visão geral do widget) 
├─ title.md (Conteúdo: título do widget)
├─ short_description.md (Conteúdo: descrição curta do widget)
├─ long_description.md (Conteúdo: descrição longa do widget)
├─ widget-id.md (Conteúdo: ID único gerado para o widget, preferencialmente um UUID, servindo como sua chave exclusiva)
├─ dist/ (Arquivo build.js final gerado pelo build, deve ter esse nome exato) 
├─ src/ (Código-fonte do widget) 
└─ print.png (Imagem mostrando a tela principal do widget finalizado)
Regras Obrigatórias de Desenvolvimento:
Build Final: O arquivo de build final de cada widget na pasta dist/ DEVE ser nomeado obrigatoriamente como build.js e ser exclusivamente um arquivo .js puro. Ele deve funcionar de forma totalmente independente quando inserido em uma página.
O Escudo de Força (Shadow DOM): O widget DEVE obrigatoriamente ser construído usando a tecnologia de Web Components e seu HTML/CSS deve ser encapsulado dentro de um Shadow DOM (attachShadow({ mode: 'open' })). Isso garante que o CSS do site de destino não quebre o widget, e que o CSS do widget não vaze para o site.
Ferramentas Leves: O desenvolvimento na pasta src/ deve utilizar ferramentas leves focadas em empacotamento de componentes isolados (como Vite ou Vanilla JS). Não utilize frameworks de renderização de servidor (como Next.js), pois o objetivo é gerar um widget injetável e não um site completo.
Proibição de Canvas: JAMAIS utilize a tag ou atributo <canvas> na criação ou estrutura de qualquer widget.
Excelência Visual: O visual do widget deve ser extremamente profissional. Não economize ao criar uma estrutura visual muito rica. Utilize as melhores práticas de design (UI/UX), cores bem harmonizadas, sombras, espaçamentos perfeitos e, se necessário, animações suaves com CSS para garantir que o widget pareça um produto de altíssima qualidade (nível Apple).
Integração Perfeita (Ocupação Integral e Sem Janelas Flutuantes): Como o widget será importado e embutido dentro de outras páginas, ele deve preencher o espaço disponível como um líquido em um recipiente. A sua raiz DEVE ocupar 100% da área de quem o hospeda, exigindo que seu CSS principal utilize larguras e alturas totais (width: 100% e height: 100%). Além disso, para evitar recortes ruins, é obrigatório remover qualquer folga, zerando espaçamentos internos e externos (margin: 0 e padding: 0) e removendo bordas do elemento principal. O código NÃO deve conter lógica de "janela flutuante", botões de "fechar/minimizar" ou eventos de arrastar pela tela. O widget deve ser apenas o seu conteúdo útil se fundindo invisivelmente à página.
Código Limpo e Sólido: O código-fonte na pasta src/ deve ser construído sobre uma arquitetura sólida. Aplique princípios de Clean Code (Código Limpo) e SOLID. O código deve ser modular, de fácil leitura e com funções de responsabilidade única, facilitando futuras manutenções.
Testes e Validação: Todo widget desenvolvido ou atualizado DEVE ser rigorosamente testado. A IA deve verificar a ausência de erros de JavaScript (console errors), falhas de renderização ou problemas de lógica. Aplique práticas como o Test Driven Development (TDD) sempre que possível, garantindo que o código passe por validações automatizadas antes do build final.
Armazenamento de Dados Isolado e ID Único: O widget possui uma chave de identificação forte e exclusiva armazenada no arquivo widget-id.md. Quando o widget precisar salvar qualquer tipo de dado do usuário, estado da aplicação ou configurações locais, a IA DEVE utilizar exclusivamente a API nativa de localStorage do navegador, sem usar bibliotecas pesadas (como PouchDB). Para manter a ordem e evitar o conflito de dados entre múltiplos widgets inseridos na mesma página, o widget DEVE obrigatoriamente utilizar o ID Único contido no arquivo widget-id.md como prefixo para todas as chaves gravadas por ele no localStorage.
