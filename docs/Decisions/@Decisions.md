# Decisions

Anotações sobre decisões tomadas que podem levar a "break changes" entre versões, a ideia é ter registros para entender o motivo dessas grandes mudanças.
___

## Versão 3.*
Neste novo update, teremos uma quebra do `Boarding/Embarque`, antes o mesmo era informado em formato de texto, por exemplo: "3 dias úteis" ou "23/12/2023", mas isso era inconsistente quando eu precisava copiar está data e passar para o sistema da empresa, onde copiar "3 dias úteis" não era funcional e me obrigava a calcular (hoje + 3 dias úteis), para assim conseguir informar a data correta ao cliente,

agora o input de `Boarding/Embarque` tem 3 formas de ser informado, por dias úteis/corridos/data-completa(ex: 23/12/2026), todos se convergem no final para dias corridos, que são armazenados no banco de dados, caso seja necessário informar a data para o cliente neste formato "23/12/2025" a UI faz o calculo automático da mesma baseado no dia em que a data está sendo informada para o cliente, por exemplo:

hoje (19/09/2026) + 23 (dias corridos) = 12/10/2026

Em suma, o app sempre vai entregar a data mais atualizada, mesmo que o calculo da cotação tenha sido feito a muito tempo atrás.

Nota: os 3 inputs de embarque são sincronizados, então caso informe uma data em dias corridos, ele vai calcular em dias úteis e também irá calcular a data completa.

___
## Versão 2.*
Nessa nova versão não terá mais "cliente", será apenas o orçamento criado, sem associação a algum cliente (CNPJ e apelido/nome), o motivo dessa mudança seria que ao associar a algum cliente, ter que usar CNPJ ou um apelido, compromete a segurança dos dados, outro motivo seria a ideia central do APP que deve ser focado em registrar produtos e preços, para ter um histórico disso, no intuito de poder rever onde determinado item foi orçado, quando, por quanto, quais outros itens foram orçados juntos, qual o fornecedor e etc.

