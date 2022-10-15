# Views News Backend  

#### Project Summary  
Views News is an social media app. This backend is a server for the app that will allow users to do the following:
* GET
    * /api/topics
    * /api/users
    * /api/articles
    * /api/articles/:article_id
    * /api/articles/:article_id/comments
* PATCH /api/articles/:article_id
* POST /api/articles/:article_id/comments
* DELETE /api/comments/:comment_id

An in-depth outline query options and functionality for each endpoint is available at GET /api.

-----
#### Hosted App  
A hosted version of the app on Heroku can be found here: [Views News](https://nc-news-application.herokuapp.com/api)  

-----
####  Repository  
This repository contains all the backend code required for the Views News App. 

-----
####  SetUp & Installation Instructions
1. Fork this repo to your own GitHub an the GitHub website.
2. Copy the HTTPS link to your GitHub. 
3. Go to your terminal and clone the respository from GitHub to your local machine in the appropriate folder (git clone <<your-github-HTTPSlink>>)
4. Open the repository in your code editor.
5. Install the following dependecies using the terminal with npm i:
    * Express
    * Jest
    * Jest-Sorted
    * Supertest
    * Pg-Format
    * Dotenv
5. Create the following documents for environment variables in the repository:
    * .env.test
    * .env.development
6. Add the following information to both .env.test:
    * PGDATABASE=nc_news_test
    * //If on Linux, also add: PGPASSWORD= <<Your PSQL password>>
7. Add the following information to both .env.development:
    * PGDATABASE=nc_news
    * //If on Linux, also add: PGPASSWORD= <<Your PSQL password>>
8. Create the SQL databases (npm run setup-dbs)
9. Run the test files (npm run app.test.js). This will automatically re-seed the tables in the database each time a test is run.

That's it. You are done.  

-----
####  Recommended Application Specifications  
**NodeJs**: v18  
**Postgres**: v14.4
