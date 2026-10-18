# Próximas etapas — agentes jurídicos

A implementação deve evoluir em incrementos verificáveis:

1. **Identidade e isolamento**: autenticação de usuário, autorização por cliente/caso e política de acesso. Nunca usar um session ID fornecido livremente pelo navegador como prova de identidade.
2. **Memória PostgreSQL**: guardar resumo mínimo aprovado, origem, data, escopo do cliente/caso, expiração e responsável. Recuperar somente memórias autorizadas para aquele usuário e caso.
3. **RAG jurídico**: indexar materiais aprovados, guardar URL/órgão/data/versão e apresentar citações verificáveis. Atualizar legislação com processo controlado.
4. **Ferramentas tipadas**: disponibilizar ações em allowlist, validar argumentos com schema, validar autorização no servidor e aplicar idempotência. Começar em modo simulado.
5. **Orquestração**: permitir que o agente coordenador convoque especialistas com orçamento de passos, timeout, limite de custo e prevenção de ciclos.
6. **Aprovação humana**: exigir aprovação para enviar comunicações externas, alterar dados de clientes, confirmar agenda, produzir orientação jurídica final, protocolar ou afetar prazos.
7. **Avaliação contínua**: conjunto de testes anonimizados/sintéticos, feedback revisado, testes de regressão e publicação versionada de prompts. Não modificar automaticamente prompts de produção.
8. **Auditoria e LGPD**: minimização, retenção, controle de acesso, exportação/exclusão conforme política aplicável, registro de ações e plano de resposta a incidentes.

Nenhuma etapa futura deve permitir que conteúdo fornecido pelo usuário ou documentos externos alterem permissões, instruções de sistema ou acesso a segredos.
