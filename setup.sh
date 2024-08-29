#!/bin/bash

function create_db() {
    echo "Setting up PostgreSQL database..."
    psql -U postgres -c "DROP DATABASE IF EXISTS todo_db;" || true
    psql -U postgres -c "CREATE DATABASE todo_db;"
}

function install_dependencies() {
    echo "Installing server and client dependencies..."
    cd server && npm install
    cd ../client && npm install
    cd ..
}

function start_backend() {
    echo "Starting the Node.js backend..."
    cd server && npm start &
    cd ..
}

function start_frontend() {
    echo "Starting the React frontend..."
    cd client && npm start &
    cd ..
}

function launch_electron() {
    echo "Launching the Electron app from the client directory..."
    cd client && electron .
}

echo "Starting setup..."
create_db
install_dependencies
start_backend
start_frontend
launch_electron