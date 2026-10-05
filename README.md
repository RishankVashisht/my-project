A Simple REST API built with NOde.js using only the built in http module ,data is stored in arrray in memory. so it resets when the server restarts.
create a foler named my project in that folder create a file named myserver.js and start the server:
node myserver.js it runs on http://localhost:3000
user format {
    "id":1,
    "name":"JOhn Doe",
    "email":"john@example.com"
}
API routes
method  |  URL  | WHAT it does | Status codes |
GET       /USERS  get all users  200
GET      /users/:id get one user  200,400,404 
POST     /users     create a user  201,400
PUT      /users/:id update a user  200,400,404
DELETE   /users/:id delete a user  200,400,404
any other URL       route not found  404
in new terminal apart from the one that us running the server
examples:-
Get all users:
Invoke-RestMethod -Method Get -Uri http://localhost:3000/users
Get one user:
Invoke-RestMethod -Method Get -Uri http://localhost:3000/users/1
Create a user:
Invoke-RestMethod -Method Post -Uri http://localhost:3000/users -ContentType "application/json" -Body '{"name":"rishi","email":"rishi@example.com"}'
Update a user:
Invoke-RestMethod -Method Put -Uri http://localhost:3000/users/2 -ContentType "application/json" -Body '{"name":"rishi Updated","email":"rishi.new@example.com"}'
Delete a user:
Invoke-RestMethod -Method Delete -Uri http://localhost:3000/users/2

