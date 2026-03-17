# nginx-unprivileged runs on port 8080 as non-root by default
FROM nginxinc/nginx-unprivileged:alpine

# Remove default config
USER root
RUN rm /etc/nginx/conf.d/default.conf
USER nginx

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/kli.conf

# Copy static frontend files
COPY src/ /usr/share/nginx/html/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
