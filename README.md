# 📝 Guide pour Déployer une Application Angular sur un VPS avec Apache et un Domaine

## 1. Préparation du VPS

Assurez-vous que votre VPS est prêt avec :

- Ubuntu installé (ou une distribution similaire).
- Apache installé et configuré.
- Node.js et npm installés.

**Commandes d'installation pour Apache, Node.js et npm :**
```
# Mettre à jour les paquets
sudo apt update

# Installer Apache
sudo apt install apache2

# Installer Node.js (version 18)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer npm
sudo apt install npm
```

## 2. Acheter un Domaine et Configurer DNS

1. **Achetez un domaine** (par exemple, dobmr.net) sur Hostinger ou un autre fournisseur.
1. **Pointez le domaine vers votre VPS** en configurant les **enregistrements A** dans votre gestionnaire DNS pour qu'ils pointent vers l'adresse IP de votre serveur VPS.


## 3. Cloner et Construire le Projet Angular

1. **Clonez votre projet Angular** sur le VPS à l'aide de ```git``` :

```
cd /var/www
git clone https://github.com/abdrahman22053/angular_hello.git
cd angular_hello
```

2. **Construisez l'application Angular** pour la production :
```
npm install
ng build --prod
```

Cette commande générera le dossier ```dist/angular-hello/browser```, qui contient les fichiers statiques prêts pour la production.


## 4. Configurer Apache pour Angular

1. **Configurer Apache pour le projet Angular** : Créez un fichier de configuration pour Apache.

```
sudo nano /etc/apache2/sites-available/angular.dobmr.net.conf
```
2. **Ajoutez la configuration suivante** :

```
<VirtualHost *:80>
    ServerName angular.dobmr.net
    ServerAdmin webmaster@dobmr.net
    DocumentRoot /var/www/angular_hello/dist/angular-hello/browser

    <Directory /var/www/angular_hello/dist/angular-hello/browser>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    FallbackResource /index.html

    ErrorLog ${APACHE_LOG_DIR}/angular_error.log
    CustomLog ${APACHE_LOG_DIR}/angular_access.log combined

    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [L,R=301]
</VirtualHost>
```

Cette configuration définit ```DocumentRoot``` comme le dossier ```browser``` généré par Angular et redirige automatiquement vers HTTPS.

3. **Activez le site :**
```
sudo a2ensite angular.dobmr.net.conf
sudo systemctl reload apache2
```

## 5. Configurer SSL pour HTTPS

1. **Installez Certbot pour Let’s Encrypt :**
```
sudo apt install certbot python3-certbot-apache
```

2. **Générez et configurez le certificat SSL :**

```
sudo certbot --apache -d angular.dobmr.net
```

3. **Créez un fichier de configuration SSL :**
```
sudo nano /etc/apache2/sites-available/angular.dobmr.net-le-ssl.conf
```

4. **Ajoutez la configuration suivante pour SSL :**
```
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName angular.dobmr.net
    ServerAdmin webmaster@dobmr.net
    DocumentRoot /var/www/angular_hello/dist/angular-hello/browser

    <Directory /var/www/angular_hello/dist/angular-hello/browser>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    FallbackResource /index.html

    ErrorLog ${APACHE_LOG_DIR}/angular_error.log
    CustomLog ${APACHE_LOG_DIR}/angular_access.log combined

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/dobmr.net/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/dobmr.net/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
</IfModule>
```

5. **Activez le site SSL :**

```
sudo a2ensite angular.dobmr.net-le-ssl.conf
sudo systemctl reload apache2
```

6. **Redémarrez Apache** pour appliquer toutes les configurations :

```
sudo systemctl restart apache2
```



