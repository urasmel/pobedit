# Use the official .NET Core SDK image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY . .

RUN ls -a
RUN dotnet restore "ControlService/ControlMicroservice.csproj"
# RUN dotnet restore
# COPY ControlService/. .
WORKDIR "/src/ControlService"
RUN dotnet build "ControlMicroservice.csproj" -c Release -o /app

# Publish the application
FROM build AS publish
WORKDIR "/src/ControlService"
RUN dotnet publish "ControlMicroservice.csproj" -c Release -o /app

# Configure the final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "ControlMicroservice.dll"]
