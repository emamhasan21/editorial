# VPS deployment

This layout exposes Editorial at `http://SERVER_IP` with no visible port. The Next.js server binds only to `127.0.0.1:3000`; Nginx is the public entry point. An existing WordPress domain can continue using its own Nginx server block, PHP pool, and database.

## 1. Small-server requirements

- 1 vCPU, 1 GB RAM, and 30 GB SSD are sufficient for a test deployment.
- Keep MariaDB bound to localhost. Never expose port 3306.
- Use at least 1–2 GB of swap and build on another computer when possible.
- Use a current Node.js LTS binary. The production service does not require npm.

## 2. Create an isolated database

Open MariaDB as an administrator and replace the example password:

```sql
CREATE DATABASE editorial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'editorial'@'localhost' IDENTIFIED BY 'A_LONG_RANDOM_PASSWORD';
GRANT ALL PRIVILEGES ON editorial.* TO 'editorial'@'localhost';
FLUSH PRIVILEGES;
```

These statements do not alter a WordPress database or account.

## 3. Build away from the VPS

On the development computer:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
cp -r public .next/standalone/
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/
```

Upload the contents of `.next/standalone` to a versioned directory such as `/var/www/editorial/releases/BUILD_ID`, then point `/var/www/editorial/current` to that directory.

Keep uploaded media in `/var/www/editorial/shared/uploads` and the runtime image cache in `/var/www/editorial/shared/cache`; link the matching release paths to these shared directories. This prevents a deployment from replacing user uploads and keeps the release itself read-only.

## 4. Configure secrets

Create `/etc/editorial/editorial.env`, owned by root with mode `600`:

```dotenv
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=448
HOSTNAME=127.0.0.1
PORT=3000
DATABASE_URL=mysql://editorial:A_LONG_RANDOM_PASSWORD@127.0.0.1:3306/editorial
BETTER_AUTH_URL=http://SERVER_IP
TRUSTED_ORIGINS=http://SERVER_IP
BETTER_AUTH_SECRET=A_DIFFERENT_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
```

Generate independent secrets with `openssl rand -hex 32`. Do not commit the production environment file.

Apply the committed SQL migrations before starting the new release. Seed only when creating a new installation; provide unique `SEED_OWNER_EMAIL`, `SEED_OWNER_PASSWORD`, and `SEED_OWNER_NAME` values.

## 5. Run with systemd

Create `/etc/systemd/system/editorial.service` and adjust the Node path if needed:

```ini
[Unit]
Description=Editorial publishing application
After=network.target mariadb.service
Wants=mariadb.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/editorial/current
EnvironmentFile=/etc/editorial/editorial.env
ExecStart=/opt/node-current/bin/node server.js
Restart=on-failure
RestartSec=5
TimeoutStopSec=20
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/editorial/shared/uploads /var/www/editorial/shared/cache
MemoryMax=600M

[Install]
WantedBy=multi-user.target
```

Then enable the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now editorial
sudo systemctl status editorial
```

## 6. Publish through the server IP

Create an Nginx default server without editing the WordPress domain's server block:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    client_max_body_size 12m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
        proxy_buffering off;
    }
}
```

Test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
curl http://SERVER_IP/api/health
```

Keep port 3000 blocked publicly; only port 80 needs to be open for this test setup.

## Operations

- Back up the `editorial` database and `/var/www/editorial/shared/uploads` together.
- Deploy with versioned release directories and switch the `current` symlink only after verification.
- Keep one previous release for quick rollback.
- Do not run Drizzle Studio on a public interface.
- Redis is not required for a single application instance.
- Add a domain and HTTPS before collecting real user credentials.
