CREATE TABLE "account"
(
    "id" SERIAL PRIMARY KEY,
    "number" VARCHAR,
    "name" VARCHAR,
    "type" VARCHAR,
    "status" VARCHAR,
    "apiKey" VARCHAR,
    "secretId" INTEGER,
    "detailId" INTEGER
);

CREATE TABLE "account-detail"
(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR,
    "address" VARCHAR
);

CREATE TABLE "contact-detail"
(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR,
    "email" VARCHAR,
    "number" VARCHAR
);

CREATE TABLE "secret"
(
    "id" SERIAL PRIMARY KEY,
    "type" VARCHAR,
    "key" VARCHAR
);
