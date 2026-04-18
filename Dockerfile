FROM golang:1.26-windowsservercore-ltsc2022 AS builder

WORKDIR C:/app

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./

RUN go build -ldflags '-s -w' -o ops-admin-backend.exe .

FROM mcr.microsoft.com/windows/nanoserver:ltsc2022

WORKDIR C:/app

COPY --from=builder C:/app/ops-admin-backend.exe .
COPY --from=builder C:/app/data ./data
COPY backend/static ./static

ENV ADDR=0.0.0.0:8080
ENV STATIC_DIR=./static

EXPOSE 8080

CMD ["ops-admin-backend.exe"]
