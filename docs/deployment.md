# VPS deployment

This setup keeps an existing WordPress site on ports 80/443 and exposes Editorial for testing at `http://SERVER_IP:3000`. MariaDB is shared as a service, but Editorial receives its own database and restricted database account.

## 1. Prepare the server

Use Node.js 20.9 or newer. Keep MariaDB bound to localhost; do not expose port 3306 publicly.

On a 1 GB server, add swap before installing/building if none exists:

```bash
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Skip these commands if swap is already configured.

## 2. Create the database

```bash
sudo mariadb
```

```sql
CREATE DATABASE editorial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'editorial'@'localhost' IDENTIFIED BY 'A_LONG_RANDOM_PASSWORD';
GRANT ALL PRIVILEGES ON editorial.* TO 'editorial'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

This does not alter the WordPress database or account.

## 3. Install the application

Clone the repository using the URL shown by GitHub’s green **Code** button, then enter the cloned directory.

```bash
npm ci
cp .env.example .env.local
nano .env.local
```

Use values like these:

```dotenv
DATABASE_URL=mysql://editorial:A_LONG_RANDOM_PASSWORD@127.0.0.1:3306/editorial
BETTER_AUTH_URL=http://SERVER_IP:3000
TRUSTED_ORIGINS=http://SERVER_IP:3000
BETTER_AUTH_SECRET=A_DIFFERENT_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
```

Generate the secret with `openssl rand -base64 32`.

```bash
npm run db:migrate
npm run build
```

Run `npm run db:seed` only if you want demo content and the temporary owner account. Change that password immediately.

## 4. Run with systemd

Create `/etc/systemd/system/editorial.service` and adjust `User` and `WorkingDirectory`:

```ini
[Unit]
Description=Editorial publishing application
After=network.target mariadb.service

[Service]
Type=simple
User=YOUR_LINUX_USER
WorkingDirectory=/absolute/path/to/editorial
Environment=NODE_ENV=production
Environment=NODE_OPTIONS=--max-old-space-size=512
Environment=HOSTNAME=0.0.0.0
Environment=PORT=3000
ExecStart=/usr/bin/node .next/standalone/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

The standalone server expects static assets beside it. After every build:

```bash
cp -r public .next/standalone/
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/
sudo systemctl daemon-reload
sudo systemctl enable --now editorial
sudo systemctl status editorial
```

## 5. Allow test access

If UFW is enabled:

```bash
sudo ufw allow 3000/tcp
```

Visit `http://SERVER_IP:3000/api/health`, then `http://SERVER_IP:3000`.

Port 3000 is suitable for a private test. For a real launch, use a domain or subdomain, reverse proxy to `127.0.0.1:3000`, enable HTTPS, remove the public port-3000 firewall rule, and update `BETTER_AUTH_URL` plus `TRUSTED_ORIGINS`.

## Operations on a small server

- Runtime memory is capped at roughly 512 MB; MariaDB and the existing WordPress/PHP stack retain the rest.
- Build during low traffic or build on another machine and upload the standalone artifacts.
- Back up the `editorial` database and `public/uploads` together.
- Do not run Drizzle Studio on a public interface.
- Redis is intentionally not required. Add it only when background jobs or multiple app instances justify it.
