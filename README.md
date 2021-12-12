# Registration-login_form-backend-Proejct
Complete Registration login form using restfull apis

its a project of backend in which new user sign up and after that login with their login credentials,
if the user valid its redirected to page which says you have logged in and if the user invalid then gets response of invalid email or wrong password.

designed restful apis for all of this which you can see inside src/app.js.
and all the data directly stored in the mongodb database.

npm package used for creation.

->nodejs expressjs
->template engine used handlebars
->for encrypting or hashing password package used -> bcrypt js
->for creating or dealing with token and cookies package used -> jsonwebtoken
-> used concept of middlewares for creating tokens and hashing passwords.
->for storing data in db mongoDB used with Mongoose.

