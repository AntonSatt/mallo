FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY Gr8/Gr8.csproj Gr8/
RUN dotnet restore Gr8/Gr8.csproj
COPY . .
RUN dotnet publish Gr8/Gr8.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Gr8.dll"]
