NC News Server SetUp

1. Clone the respository from GitHub to your local machine.
2. Create the following documents for environment variables in the repository:
    .env.test
    .env.development
3. Add the following information to both .env.test:
    PGDATABASE=nc_news_test
    //If on Linux, also add:
    PGPASSWORD= <<Your PSQL password>>
4. Add the following information to both .env.development:
    PGDATABASE=nc_news
    //If on Linux, also add:
    PGPASSWORD= <<Your PSQL password>>