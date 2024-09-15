# CCA - Complicated Chat App

A chat application that integrates Redis for managing online status and includes a notification system .

## How to Run

### Set Up Redis Locally

#### Build Redis Docker Image
First, build the Redis Docker image:

```bash
docker build -t cca-redis-image -f Dockerfile.redis .
```
#### Run Redis Container
```bash
docker run -d --name cca-redis-container -p 6379:6379 cca-redis-image
```
If the Redis Container Already Exists
start it with:
```bash
docker start cca-redis-container

```
### Start the Application
```bash
npm start
```

###  Notes
Environment Variables: .env is not included for convenience, but you should configure it with appropriate values before running in production.
Online Status: This feature has been implemented and should work as expected.
Notification System: The notification system is currently untested and requires further modification.

###  Best Practices
It's recommended to include .env.example with default values to help users set up their environment quickly.
Consider adding testing for the notification system before moving to production.
