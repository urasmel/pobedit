#Pobedit

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
-   CI/CD
-   K8s

### Backend

-   Docker
-   k8s
-   Postgres
-   MassTransit
-   AutoMapper
-   EF Core
-   Nunit
-   Serilog
-   Quartz
-   Kubernetes, Temporal, Camunda, Zeebe, Camel, Kafka, RabbitMQ, Service Mesh.

Оператор вносит в базу несколько пользователей (users), с помощью разных сим-карт.
Каждый пользователь подписан на различные группы, чаты и т. д., имеет возможность переписываться
с различными аккаунтами (accaunts), которые тоже заносятся в БД.

Просмотр сообщений только из БД.

-   загрузка в БД производится запуском команды загрузки данных
-   сохранение комментрарией с указазанием того, кто его написал
-   сохранение аккаунтов
-   возможность просмотреть историю публикаций и комментрариев аккаунта
