FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Gr8.slnx .
COPY Api/Gr8.Api.csproj Api/
COPY Application/Gr8.Application.csproj Application/
COPY Domain/Gr8.Domain.csproj Domain/
COPY Infrastructure/Gr8.Infrastructure.csproj Infrastructure/
RUN dotnet restore Gr8.slnx

COPY . .
RUN dotnet publish Api/Gr8.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Gr8.Api.dll"]
