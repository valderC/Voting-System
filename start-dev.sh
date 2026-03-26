#!/bin/bash

# Start both backend and frontend dev servers
# Press Ctrl+C to stop both

trap 'kill 0' EXIT

echo "Starting Spring Boot backend..."
./mvnw spring-boot:run &

echo "Starting Angular frontend..."
cd voting-ui && npm start &

wait
