COMPOSE ?= docker compose

.PHONY: server server-detach server-stop server-logs

server:
	$(COMPOSE) up --build

server-detach:
	$(COMPOSE) up -d --build

server-stop:
	$(COMPOSE) down

server-logs:
	$(COMPOSE) logs -f

