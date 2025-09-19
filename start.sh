#!/bin/sh

# Exit immediately if a command fails
set -e

# Use 'envsubst' to substitute the value of ${PORT} in the template
# and output it to the actual Nginx config file.
envsubst '$PORT' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

echo "--- Nginx configuration generated for port ${PORT} ---"
cat /etc/nginx/conf.d/default.conf
echo "----------------------------------------------------"

# Start Nginx in the foreground
nginx -g 'daemon off;'
