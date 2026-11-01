# Projeto

Nome do projeto: `Bear Budgets`

___

## Objetivo

O objetivo deste projeto é criar um sistema de criação de orçamentos de forma fácil, visando principalmente o registro de dados, onde é possível rever estes dados e até mesmo reutilizá-los posteriormente para outros orçamentos.

___

## Usuários

Este projeto terá apenas um usuário por instalação do aplicativo, todos os registros permanecem na máquina onde o aplicativo foi iniciado, o sistema funciona 100% offline.

___

## Funcionalidades    

### Orçamentos  
  
- `Criar` orçamento  
- `Visualizar` orçamento  
### Itens  
  
- `Criar` item de referência  (apenas dentro do orçamento por enquanto)
- `Reutilizar` item em novos orçamentos  
- `Buscar` itens cadastrados  
- `Reordenar` itens dentro do orçamento  enquanto o mesmo é criado

### Dados do item  

#### Referência  
  
- Links de referência  
- Notas  
- NCM  
- Descrição  
- Código interno  
- Código do fabricante  

#### Valores  
  
- Quantidade  
- Valor unitário  
- Markup  
- IPI  
- ST  
- Frete de compra  
- Embarque  
- Valor extra

___

## Características extras 

- 100% offline  
- Dados armazenados em SQLite  
- Tema claro e escuro  
- Sem dependência de internet

___

## Funcionalidades planejadas

 - Reduzir vários orçamentos em um único orçamento
 - `Editar` referencia do item
 - `Editar` valores do item
 - `Editar` orçamento
 - `Buscar` orçamento
 - Definir/Alterar status do orçamento
 - `Reutilizar` valores de itens já registrados em outros orçamentos
 - `Buscar` cliente
 - `Editar` cliente

___

## Stack

- React
- SQLite
- Electron