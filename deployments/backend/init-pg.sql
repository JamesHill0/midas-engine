CREATE TABLE "account"
(
    "id" SERIAL PRIMARY KEY,
    "number" VARCHAR,
    "name" VARCHAR,
    "type" VARCHAR,
    "status" VARCHAR,
    "apiKey" VARCHAR,
    "externalApiKey" VARCHAR,
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

INSERT INTO "secret"
VALUES
(
  1,
  'postgres',
  '8a467e5917ac4ff21009b98b9457219a6a66393acf952dd2e1edbd818b7a435155c03d69213c7a73495a3f52c4a5e44b1b8077f4e131fa181d8ae678b0b3149680b9b80e50ff704b6392893ae93765f2af06711597975cf55a52c8ff8998aeeba7da9af3a829cc1563027baa633da5d02812c1cd48c20e891cc5ea1c77e0adc04967af27856996c619b78c0ff1b65446de9719e52c9bd089c03c59109ba654db40154205ff40fe92837e27749d80f0d272285f8e8490a7d8a169d7746b4f6a6a472c400a1fa28f8358'
)

INSERT INTO "account-detail"
VALUES
(
  1,
  "Magellan-QA",
  ""
)

INSERT INTO "account"
VALUES
(
  1,
  'I-1672455183',
  'Magellan-QA',
  'Internal',
  'active',
  '02d29541-8783-4c65-8ee6-f08693f89fe7',
  '26488b44-446c-4e93-9f98-86db0ab8ebf0',
  1,
  1
)

INSERT INTO "secret"
VALUES
(
  2,
  'postgres',
  '8a467e5917ac4ff21009b98b9457219a6a66393acf952dd2e1edbd818b7a435155c03d69213c7a73495a3f52c4a5e44b1b8077f4e131fa181d8ae678b0b3149680b9b80e50ff704b6392893ae93765f2af06711597975cf55a52c8ff8998aeeba7da9af3a829cc1563027baa633da5d02812c1cd48c20e891cc5ea1c77e0adc04967af27856996c619b78c0ff1b65446de9719e52c9bd089c03c59109ba654db40154205ff40fe92837e27749d80f0d272285f8e8490a7d8a169d7746b4f6a6a472c400a1fa28f8358'
)

INSERT INTO "account-detail"
VALUES
(
  2,
  "Magellan-Prod",
  ""
)

INSERT INTO "account"
VALUES
(
  2,
  'I-1672455358',
  'Magellan-Prod',
  'Internal',
  'active',
  'c169d18d-96b0-4cd1-abe1-617c177e3dd9',
  'a4a39dbd-8aa4-4cf1-b97a-97997da83da4',
  2,
  2
)
