# nginx-unprivileged runs on port 8080 as non-root by default
FROM nginxinc/nginx-unprivileged:alpine

USER root
# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# ENVIRONMENT build arg — staging (default) or production
ARG ENVIRONMENT=staging

# Copiem ambele fișiere temporar
COPY nginx.conf /tmp/nginx.staging.conf
COPY nginx.prod.conf /tmp/nginx.prod.conf


RUN mkdir -p /etc/nginx/templates && \
    if [ "$ENVIRONMENT" = "production" ]; then \
        mv /tmp/nginx.prod.conf /etc/nginx/templates/kli.conf.template; \
    else \
        mv /tmp/nginx.staging.conf /etc/nginx/templates/kli.conf.template; \
    fi && \
    rm -f /tmp/nginx.*

USER nginx
COPY src/ /usr/share/nginx/html/

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]