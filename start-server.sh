#!/bin/bash
cd server

npm install

npx prisma migrate dev

npm start 