# Pobedit

## Techs

### Fontend

-   TypeScript, zustand
-   Feature-sliced design
-   GraphQL
-   Unit tests
-   Module federation
-   Optimization
-   SCSS
-   Storybook
-   Valibot
-   Headless UI
-   Vitest
-   React Hook Form

### Backend

-   Docker
-   Postgres
-   AutoMapper
-   EF Core
-   Nunit
-   WebSocket
-   MassTransit - provides a modern platform for creating distributed applications without complexity
-   k8s
-   Serilog
-   Quartz - open-source job scheduling system for .NET
-   CI/CD
-   Temporal - a distributed, scalable, durable, and highly available orchestration engine used to execute asynchronous, long-running business logic in a scalable and resilient way
-   Camunda - Universal process orchestration
-   Zeebe - Zeebe is a service orchestrator but it uses events internally
-   Kafka, RabbitMQ
-   Service Mesh
-   Grafana

## Определения и часть функционала

Оператор вносит в базу несколько пользователей (users), с помощью разных сим-карт.
Каждый пользователь подписан на различные группы, чаты и т. д., имеет возможность переписываться
с различными аккаунтами (accaunts), которые тоже заносятся в БД.

-   Просмотр сообщений только из БД.
-   загрузка в БД производится запуском команды загрузки данных
-   сохранение комментрариев с указазанием того, кто его написал
-   сохранение аккаунтов
-   возможность просмотреть историю публикаций и комментрариев аккаунта

## Запуск

### При разработке

-   запустить docker-контейнер с базой данных
-   запустить Visual Studio и проекты сервисов бэкенда
-   запустить VS Code и проект фронтенда
-   запустить остальные средства разработки (DatGrip, Postman)

### На продакшене

-   проверить работоспособность скрипта CI/CD (localhost:8080, login: protype)
-   запустить его и убедиться, что он завершен без ошибок
-   проект запущен (в случае передачи в другое подразделение отдать набор контейнеров и инструкии по конфигураии)
