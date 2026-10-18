# OmniRoute — ambiente de testes

## Objetivo e limites desta etapa

Esta alteração adiciona um adaptador server-side opcional para OmniRoute e roteamento inicial por especialidade. O comportamento padrão permanece Gemini: o serviço só usa OmniRoute quando `AI_PROVIDER=omniroute`. O contrato público permanece `POST /api/chat` com resposta `{ "reply": "..." }`.

Esta etapa **não** implementa memória persistente, ferramentas reais, execução de tarefas externas, consulta de jurisprudência em tempo real ou treinamento automático. A seleção de especialista é baseada em regras simples e serve como ponto de partida, não como sistema autônomo completo.

## Variáveis de ambiente do serviço de teste

Configure apenas no painel Environment do serviço de teste no Render:

- `AI_PROVIDER=omniroute`
- `OMNIROUTE_BASE_URL=https://<host-privado-do-omniroute>/v1` (ajuste ao endereço real do serviço)
- `OMNIROUTE_API_KEY=<segredo-gerado-no-omniroute>`
- `OMNIROUTE_MODEL=<id-de-modelo-validado>`

Não use prefixo `VITE_` nessas variáveis. Não grave chaves no repositório, logs, frontend ou documentação. Não configure essas variáveis no serviço de produção durante a fase de testes.

Se `AI_PROVIDER` estiver ausente ou for diferente de `omniroute`, o backend mantém o caminho Gemini existente.

## Implantação sugerida

1. Criar um serviço de teste separado no Render a partir desta branch; não apontar o serviço de produção para ela.
2. Criar/selecionar o serviço OmniRoute em ambiente de teste, com autenticação habilitada e acesso de rede restrito.
3. Configurar as quatro variáveis acima apenas no serviço de teste.
4. Fazer deploy de staging e confirmar `GET /api/health`.
5. Testar `POST /api/chat` com dados fictícios; verificar que a resposta continua contendo `reply`.
6. Testar falhas de gateway, chave ausente, timeout, mensagens longas e rate limit.
7. Revisar logs para garantir que mensagens, segredos e conteúdo de respostas sensíveis não sejam registrados.
8. Só considerar produção após revisão jurídica, de segurança, custos e privacidade.

## Segurança e limites operacionais

- Não há autenticação de usuário/cliente nem isolamento por caso adicionados nesta etapa. Não use com dados reais sigilosos.
- O adaptador não executa ferramentas. A especialidade `operations` não agenda, envia, protocola nem altera CRM.
- Não habilitar ações jurídicas irreversíveis nem prazos automatizados sem validação humana.
- O limitador atual do backend é em memória e não distribuído; endurecê-lo antes de tráfego relevante.
- A memória deve ser implementada separadamente em PostgreSQL com isolamento por tenant/cliente, controle de acesso, retenção e auditoria antes de qualquer uso real.
- O gateway OmniRoute precisa de autenticação, configuração persistente e política de atualização própria. Não expor sua interface administrativa à internet pública.

## Critérios para considerar esta etapa aprovada

- [ ] Gemini continua funcionando quando `AI_PROVIDER` não é `omniroute`.
- [ ] OmniRoute só é ativado no serviço de teste por variável server-side.
- [ ] `POST /api/chat` mantém a resposta `{ reply }`.
- [ ] Nenhum segredo aparece no bundle, endpoint de configuração ou logs.
- [ ] Erros de gateway retornam erro genérico ao cliente e não vazam resposta interna.
- [ ] Build e typecheck passam.
- [ ] Revisão humana dos riscos e custos concluída.
