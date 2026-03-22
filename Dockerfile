# nginx-unprivileged runs on port 8080 as non-root by default
FROM nginxinc/nginx-unprivileged:alpine

# Remove default config
USER root
RUN rm /etc/nginx/conf.d/default.conf

# ENVIRONMENT build arg — staging (default) or production
ARG ENVIRONMENT=staging
COPY nginx.conf /etc/nginx/conf.d/nginx.staging.conf
COPY nginx.prod.conf /etc/nginx/conf.d/nginx.prod.conf
RUN cp /etc/nginx/conf.d/nginx.${ENVIRONMENT}.conf /etc/nginx/conf.d/kli.conf && \
    rm /etc/nginx/conf.d/nginx.staging.conf /etc/nginx/conf.d/nginx.prod.conf

USER nginx

# Copy static frontend files
COPY src/ /usr/share/nginx/html/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
