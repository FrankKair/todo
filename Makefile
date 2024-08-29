CLIENT_DIR = client
SERVER_DIR = server

.PHONY: all
all: install-db start-db setup-client setup-server run-electron

.PHONY: install-db
install-db:
	@echo "Setting up PostgreSQL database..."
	@psql -U postgres -c "DROP DATABASE IF EXISTS todo_db;" || true
	@psql -U postgres -c "CREATE DATABASE todo_db;"

.PHONY: start-db
start-db:
	@echo "Starting PostgreSQL database service..."
	@pg_ctl -D /usr/local/var/postgres start

.PHONY: install-deps
install-deps:
	@echo "Installing dependencies..."
	@cd $(CLIENT_DIR) && npm install
	@cd $(SERVER_DIR) && npm install

.PHONY: setup-client
setup-client: install-deps
	@echo "Starting the React frontend (client)..."
	@cd $(CLIENT_DIR) && npm run start &

.PHONY: setup-server
setup-server: install-deps
	@echo "Starting the Node.js backend (server)..."
	@cd $(SERVER_DIR) && npm run start &

.PHONY: run-electron
run-electron:
	@echo "Launching Electron app..."
	@cd client && electron .

.PHONY: clean
clean:
	@echo "Stopping PostgreSQL database service..."
	@pg_ctl -D /usr/local/var/postgres stop
	@psql -U postgres -c "DROP DATABASE IF EXISTS todo_db;"