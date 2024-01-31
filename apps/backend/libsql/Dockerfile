FROM --platform=$TARGETPLATFORM ghcr.io/tursodatabase/libsql-server:latest

ARG TARGETPLATFORM

USER root
RUN apt-get update && apt-get -y install wget unzip && PLATFORM=$( \
      case ${TARGET_PROTFORM} in \
        linux/arm64 ) echo "aarch_64" ;; \
        * ) echo "x86_64";; \
      esac \
    ) && \
    wget https://github.com/vlcn-io/cr-sqlite/releases/download/v0.16.3/crsqlite-linux-${PLATFORM}.zip -O ./tmp.zip && unzip ./tmp.zip -d /extension && rm -rf tmp.zip && cd /extension && sha256sum *.so > ./trusted.lst
USER sqld
CMD ["/bin/sqld", "--enable-namespaces", "--extensions-path=/extension"]
