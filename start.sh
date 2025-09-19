#!/bin/sh

# Use 'envsubst' to substitute the value of ${PORT} in the template
# and output it to the actual Nginx config file.
envsubst < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Start Nginx in the foreground. This is crucial for the container to stay running.
nginx -g 'daemon off;'