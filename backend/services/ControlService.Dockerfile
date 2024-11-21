FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 5114
ENV ASPNETCORE_URLS=http://+:5114

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY . .

RUN dotnet restore "ControlService/ControlMicroservice.csproj"

WORKDIR "/src/ControlService"
RUN dotnet build "ControlMicroservice.csproj" -c Release -o /app/release/ControlService

# Publish the application
FROM build AS publish
WORKDIR "/src/ControlService"
RUN dotnet publish "ControlMicroservice.csproj" -c Release -o /app/publish/ControlService

# Configure the final image
FROM base AS final
WORKDIR /app/publish/ControlService
COPY --from=publish /app/publish/ControlService .
ENTRYPOINT ["dotnet", "ControlMicroservice.dll", "--server.urls", "http://0.0.0.0:5114"]
