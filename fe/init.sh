#!/bin/bash

rm -rf ./.env

printf 'APP_BASE_URL="%s"\n' "$APP_BASE_URL" >> ./.env
printf 'APP_API_KEY="%s"\n' "$APP_API_KEY" >> ./.env
