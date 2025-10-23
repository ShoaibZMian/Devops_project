#!/bin/sh

# Generate env-config.js with runtime environment variables
cat > /usr/share/nginx/html/env-config.js <<EOF
window._env_ = {
  REACT_APP_HOST_IP_ADDRESS: "${REACT_APP_HOST_IP_ADDRESS}"
};
EOF

# Start nginx
nginx -g 'daemon off;'
