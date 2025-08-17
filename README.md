docker-compose -f docker-compose.yml up --build

docker-compose down

rm -rf node_modules package-lock.json
npm install
npm install iterare
npm run start:dev


netstat -ano | findstr :3000
TCP    0.0.0.0:3000   0.0.0.0:0   LISTENING   12345
taskkill /PID 8316 /PID 16120 /F [Run it on power shell]

docker pull mysql
docker run --name mysql -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=mydb -d -p 3306:3306 mysql:8.0
docker run --name phpmyadmin --link mysql:db -d -e PMA_HOST=mysql -e MYSQL_ROOT_PASSWORD=rootpass -p 8080:80 phpmyadmin/phpmyadmin
Username: root   Password: rootpass


docker run --name mysql -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=mydb -e MYSQL_ROOT_HOST=% -d -p 3306:3306 mysql:8.0
