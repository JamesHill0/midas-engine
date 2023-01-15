FROM python:3.8.9-alpine

ARG LOGGER_ALERTING
ARG LOGGER_SLACK
ARG SLACK_WEBHOOK_INCOMING
ARG API_BASE_URL
ARG POSTGRES_HOST
ARG POSTGRES_DATABASE
ARG POSTGRES_USERNAME
ARG POSTGRES_PASSWORD
ARG RABBIT_MQ_HOST
ARG RABBIT_MQ_USERNAME
ARG RABBIT_MQ_PASSWORD
ARG RABBIT_MQ_PATTERN

WORKDIR /app

COPY . ./

RUN apk -U upgrade
RUN apk add --update \
  build-base \
  cairo \
  cairo-dev \
  cargo \
  freetype-dev \
  gcc \
  gdk-pixbuf-dev \
  gettext \
  jpeg-dev \
  lcms2-dev \
  libffi-dev \
  musl-dev \
  openjpeg-dev \
  openssl-dev \
  pango-dev \
  poppler-utils \
  postgresql-client \
  postgresql-dev \
  py-cffi \
  python3-dev \
  rust \
  tcl-dev \
  tiff-dev \
  tk-dev \
  zlib-dev

ADD requirements.txt /var/www/requirements.txt
RUN pip install --upgrade pip
RUN pip install cryptography
RUN pip install -r requirements.txt

RUN rm -rf ./.env
RUN printf 'LOGGER_ALERTING="%s"\n' "${LOGGER_ALERTING}" >> ./.env
RUN printf 'LOGGER_SLACK="%s"\n' "${LOGGER_SLACK}" >> ./.env
RUN printf 'SLACK_WEBHOOK="%s"\n' "${SLACK_WEBHOOK}" >> ./.env
RUN printf 'API_BASE_URL="%s"\n' "${API_BASE_URL}" >> ./.env
RUN printf 'POSTGRES_HOST="%s"\n' "${POSTGRES_HOST}" >> ./.env
RUN printf 'POSTGRES_DATABASE="%s"\n' "${POSTGRES_DATABASE}" >> ./.env
RUN printf 'POSTGRES_USERNAME="%s"\n' "${POSTGRES_USERNAME}" >> ./.env
RUN printf 'POSTGRES_PASSWORD="%s"\n' "${POSTGRES_PASSWORD}" >> ./.env
RUN printf 'RABBIT_MQ_HOST="%s"\n' "${RABBIT_MQ_HOST}" >> ./.env
RUN printf 'RABBIT_MQ_USERNAME="%s"\n' "${RABBIT_MQ_USERNAME}" >> ./.env
RUN printf 'RABBIT_MQ_PASSWORD="%s"\n' "${RABBIT_MQ_PASSWORD}" >> ./.env
RUN printf 'RABBIT_MQ_PATTERN="%s"\n' "${RABBIT_MQ_PATTERN}" >> ./.env

RUN printf '*/30 * * * * python /extract.py\n' >> /etc/crontabs/root
RUN printf '*/30 * * * * python /transform.py\n' >> /etc/crontabs/root
RUN printf '*/30 * * * * python /load.py\n' >> /etc/crontabs/root

CMD ["crond", "-f"]
