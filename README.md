# cca
complicated chat app 

# HOW TO RUN 

First setup redis on local 

# RUN  || it may require sudo permisson 
docker build -t cca-redis-image -f Dockerfile.redis .

docker run -d --name cca-redis-container -p 6379:6379 cca-redis-image

## if already has the container 
docker start cca-redis-container
# To start the app after setting up 
npm start





# NOTE

havent included .env for convenience

implemented online status 

the notification system is not tested and require modification