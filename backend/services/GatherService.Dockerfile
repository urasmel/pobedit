FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 5038
ENV ASPNETCORE_URLS=http://+:5038

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY . .

RUN dotnet restore "/src/GatherService/GatherMicroservice.csproj"

WORKDIR /src/GatherService
RUN dotnet build "GatherMicroservice.csproj" -c Release -o /app/release/GatherService

# Publish the application
FROM build AS publish
WORKDIR /src/GatherService
RUN dotnet publish "GatherMicroservice.csproj" -c Release -o /app/publish/GatherService

# # Configure the final image
FROM base AS final
WORKDIR /app/publish/GatherService
COPY --from=publish /app/publish/GatherService .
ENTRYPOINT ["dotnet", "GatherMicroservice.dll", "--server.urls", "http://0.0.0.0:5038"]
