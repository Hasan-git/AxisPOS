Hosts:
127.0.0.1 blog.dev
127.0.0.1 axispos.dev


#npm install -g gulp bower
#npm install
#bower install
#fix database credentials in .env

# Watching assets
#gulp && gulp watch

php artisan config:clear //optional
php artisan cache:clear
php artisan migrate



php artisan key:generate

php artisan passport:client --password
php artisan db:seed

composer dump-autoload

php artisan serve
