FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["FinanceFocus.API/FinanceFocus.API.csproj", "FinanceFocus.API/"]
COPY ["FinanceFocus.Application/FinanceFocus.Application.csproj", "FinanceFocus.Application/"]
COPY ["FinanceFocus.Domain/FinanceFocus.Domain.csproj", "FinanceFocus.Domain/"]
COPY ["FinanceFocus.Infrastructure/FinanceFocus.Infrastructure.csproj", "FinanceFocus.Infrastructure/"]

RUN dotnet restore "FinanceFocus.API/FinanceFocus.API.csproj"

COPY . .
WORKDIR "/src/FinanceFocus.API"
RUN dotnet build "FinanceFocus.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FinanceFocus.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .

USER app

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/health/live || exit 1

ENTRYPOINT ["dotnet", "FinanceFocus.API.dll"]
