#open apache  http-vhosts.conf and add the virtual hosts. please, modify ur project directory

<VirtualHost *:80>
  ServerName axispos-api.dev
  DocumentRoot "C:\wamp64\www\Github\AxisPOS\AxisPOS.Api\public"
  ServerAlias axispos-api.dev
    <Directory  "C:\wamp64\www\Github\AxisPOS\AxisPOS.Api">
    Options +Indexes +Includes +FollowSymLinks +MultiViews
    AllowOverride All
    Require local
  </Directory>
</VirtualHost>

<VirtualHost *:80>
  ServerName axispos.dev
  DocumentRoot "C:\wamp64\www\Github\AxisPOS\Vendor.App"
  ServerAlias blog.dev
    <Directory  "C:\wamp64\www\Github\AxisPOS\Vendor.App">
    Options +Indexes +Includes +FollowSymLinks +MultiViews
    AllowOverride All
    Require local
  </Directory>
</VirtualHost>

#open C:\Windows\System32\drivers\etc , add these records to hosts files, u may need administrative privileges for modifications

127.0.0.1 axispos-api.dev
127.0.0.1 axispos.dev

composer install

#create and fix database name & credentials in .env

php artisan config:clear //optional
php artisan cache:clear
php artisan migrate
php artisan key:generate

# create grant password client
php artisan passport:client --password
#from cmd copy the Id and Client secret to Vendor.api/enviroment.js

# seed roles and users, clients
php artisan db:seed

#reload
composer dump-autoload


#COMMANDS TO BE CONSIDERED
#npm install -g gulp bower
#npm install
#bower install
# Watching assets
#gulp && gulp watch
#php artisan serve
