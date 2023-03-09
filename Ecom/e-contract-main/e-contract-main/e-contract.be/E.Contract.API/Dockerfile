FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["E.Contract/E.Contract.API", "."]
COPY ["E.Contract/E.Contract.Framework.Validator","../E.Contract.Framework.Validator"]
RUN dotnet restore "E.Contract.API.csproj"
RUN dotnet build "E.Contract.API.csproj" -c Release -o /app/build
RUN dotnet publish "E.Contract.API.csproj" -c Release -o /app/publish
COPY ["E.Contract/E.Contract.API/Template", "/app/publish/Template"]

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
RUN apt-get update &&\
    apt-get install tzdata &&\
    apt-get install libfontconfig -y
RUN echo "deb http://httpredir.debian.org/debian buster main contrib non-free" > /etc/apt/sources.list \ 
    && echo "deb http://httpredir.debian.org/debian buster-updates main contrib non- free" >> /etc/apt/sources.list \
    && echo "deb http://security.debian.org/ buster/updates main contrib non-free" >> /etc/apt/sources.list \
    && echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections \
    && apt-get update \
    && apt-get install -y \
        fonts-arphic-ukai \
        fonts-arphic-uming \
        fonts-ipafont-mincho \
        fonts-ipafont-gothic \
        fonts-unfonts-core \
        ttf-wqy-zenhei \
        ttf-mscorefonts-installer \
    && apt-get clean \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV TZ=Asia/Bangkok \
    LANG="en_US.UTF-8"
ENTRYPOINT ["dotnet", "E.Contract.API.dll"]