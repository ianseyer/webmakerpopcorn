**Installing Webmaker Popcorn on Heroku**

This guide assumes a *NIX system

What you need:

A heroku account with the capability of making 8 Applications.

An Amazon AWS account. You will need an S3 bucket, 2 SQS queues, and SES with decent daily mailing limits.

A MongoDB from somewhere (I recommend mongolab.com)

A hosted Elastic Search (https://www.found.no/)


Here is a reference list. You will be using many keys, URLs, DB names, and other parameters across several Heroku configurations, so it is handy to keep your information in one place for quick config.

* AWS Client key:

* AWS Secret key:

* S3 Bucket name:

* S3 Bucket region:

* SQS #2 “outgoing” URL:

* SQS region:

* login.webmaker Heroku URL:

* webmaker.org Heroku URL:

* popcorn.webmaker Heroku URL:

* api.webmaker.org Heroku URL:

* MakeAPI Heroku URL:

* Heroku MySQL URL:

* MongoDB URL:

* Heroku Postgres URL:

* Elastic Search URL:











Amazon configuration:
Gather your Client & Secret key, and note them above.

Create an S3 bucket. Note the region. Now, click on your bucket and click “properties.” Under “permissions,” add a new permission with Grantee “everyone” that grants them all permissions.

Under “Static website hosting” click “enable website hosting” and put “index.html” and “error.html” in the following fields. Save your changes.

Now, create 2 SQS Queues. Name one “incoming” and one “outgoing.” Note both regions (they should be the same). Gather their URLs.

SES should be enabled by default. However, you will want to upgrade your quota limits so that you can send emails to “unverified” emails.

Heroku configuration:

In total, you will be making 8 distinct Heroku applications. Make sure you have the Heroku Toolchain installed. Most of the apps require little configuration beyond filling out the information that you have gathered above, and putting it in the corresponding environment variable.

git clone https://github.com/ianseyer/webmakerpopcorn

cd into each directory and run `heroku create`

Note each heroku URL above. http://<app name>.herokuapp.com

Provision a MySQL url in your popcorn.webmaker.org/ directory. `heroku addons:create cleardb:ignite`

note your MySQL url by running `heroku config | grep CLEARDB_DATABASE_URL`

provision a Postgres DB in your api.webmaker.org directory: `heroku addons:create heroku-postgresql:hobby-dev`

 note the url of the DB above by running `heroku config -s | grep HEROKU_POSTGRESQL`













Popcorn

  ```
  1. cd popcorn.webmaker.org

  2. open lib/default-config.js with your favorite text editor

  3. change MAKE_ENDPOINT to MakeAPI Heroku URL

  4. change LOGIN_SERVER_URL_WITH_AUTH to `https://testuser:password@<Login Heroku URL>

  5. change LOGIN_SERVER_URL to your Heroku login.webmaker URL

  6. change AUDIENCE to your api.webmaker URL

  7. change USER_SUBDOMAIN to “” (empty quotes

  8. fill in your AWS bucket information. don’t worry about DOMAIN/EMULATION

  9. fill in your DB information, as noted in step #5 above

  10. save & exit the document

  11. run `git add . && git commit -m ‘updating config’ && git push heroku master```



MakeAPI

  ```
  1. cd ../MakeAPI

  2. open .env in your favorite text editor

  3. change MONGO_URL to your mongo url noted above

  4. change LOGIN_SERVER_URL_WITH_AUTH to the same as #4 above

  5. change ELASTIC_SEARCH_URL to your elastic search URL

  6. save/close

  7. git add . && git commit -m ‘updating config’ && git push heroku master
  ```


api.webmaker.org

  `cd ../api.webmaker.org

  open .env in your favorite text editor

  change POSTGRES_CONNECTION_STRING to reflect your Postgres DB

  git add . && git commit -m ‘updating config’ && git push heroku master`


webmaker.org

  `cd ../webmaker.org

  open .env in your favorite text editor

  change LOGIN_EMAIL_URL to your api.webmaker.org URL

  change MAKE_ENDPOINT to MakeAPI

  change AUDIENCE to your api.webmaker.org URL

  change LOGIN to your login.webmaker URL

  change LOGINAPI “http://testuser:password@<your login.webmaker URL>”

  save/close

  git add . && git commit -m ‘updating config’ && git push heroku master`


login.webmaker.org

  `cd ../login.webmaker.org

  open .env in your favorite text editor

  change WEBMAKERORG to your webmaker.org URL

  change PROFILE to “.<your webmaker.org URL>” (note dot)

  fill in your AWS information

  fill in DB_URL with your MySQL db URL

  fill in APP_HOSTNAME with your login.webmaker.org URL

  fill in LOGINAPI with “http://testuser:password@”+ your login.webmaker.org URL

  git add . && git commit -m ‘updating config’ && git push heroku master`


sawmill

sawmill cannot use a .env file. to set variables, run

heroku config:set KEY=VALUE

  `cd ../sawmill

  set AWS_QUEUE_REGION to your SQS queue region

  set INCOMING_QUEUE_URL to your incoming queue URL

  set OUTGOING_QUEUE_URL to your outgoing queue URL

  set WORKER_ARCHIVER_CONNECTION_STRING to your postgres connection URI

  set HATCHET_QUEUE_REGION to your SQS queue region

  set HATCHET_QUEUE_URL to your incoming queue URL

  set AWS_ACCESS_KEY_ID to your AWS access key

  set AWS_SECRET_ACCESS_KEY to your AWS secret

  git push heroku master`


lumberyard

lumberyard also cannot use a .env file

  `cd ../lumberyard

  set AWS_ACCESS_KEY_ID to your AWS access key

  set AWS_SECRET_ACCESS_KEY to your AWS secret

  set INCOMING_QUEUE_URL to your incoming queue URL

  set AWS_QUEUE_REGION to your SQS queue region

  set WEBMAKER_URL to your webmaker.org URL`


make-valet

make-valet also cannot use a .env file

  `cd ../make-valet

  set STATIC_DATA_STORE to
   http://yourbucket.s3-website-your-region.amazonaws.com

  set MAKE_ENDPOINT to your MakeAPI URL

  set WEBMAKERORG to your webmaker.org URL

  git push heroku master`
