#**Installing Webmaker Popcorn on Heroku**

###This guide assumes a *NIX system

##What you need:

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











##**Amazon configuration:**
Gather your Client & Secret key, and note them above.

Create an S3 bucket. Note the region. Now, click on your bucket and click “properties.” Under “permissions,” add a new permission with Grantee “everyone” that grants them all permissions.

Under “Static website hosting” click “enable website hosting” and put “index.html” and “error.html” in the following fields. Save your changes.

Now, create 2 SQS Queues. Name one “incoming” and one “outgoing.” Note both regions (they should be the same). Gather their URLs.

SES should be enabled by default. However, you will want to upgrade your quota limits so that you can send emails to “unverified” emails.

##**Heroku configuration:**

In total, you will be making 8 distinct Heroku applications. Make sure you have the Heroku Toolchain installed. Most of the apps require little configuration beyond filling out the information that you have gathered above, and putting it in the corresponding environment variable.

```
1. git clone https://github.com/ianseyer/webmakerpopcorn

2. cd into each directory and run `heroku create`

3. Note each heroku URL above. http://<app name>.herokuapp.com

4. Provision a MySQL url in your popcorn.webmaker.org/ directory. `heroku addons:create cleardb:ignite`

5. note your MySQL url by running `heroku config | grep CLEARDB_DATABASE_URL`

6. provision a Postgres DB in your api.webmaker.org directory: `heroku addons:create heroku-postgresql:hobby-dev`

7. note the url of the DB above by running `heroku config -s | grep HEROKU_POSTGRESQL`
```












##**Popcorn**

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

  11. run `git add . && git commit -m ‘updating config’ && git push heroku master`
  ```



##MakeAPI

  ```
  1. cd ../MakeAPI

  2. open .env in your favorite text editor

  3. change MONGO_URL to your mongo url noted above

  4. change LOGIN_SERVER_URL_WITH_AUTH to the same as #4 above

  5. change ELASTIC_SEARCH_URL to your elastic search URL

  6. save/close

  7. git add . && git commit -m ‘updating config’ && git push heroku master
  ```


##**api.webmaker.org**
```
  1. `cd ../api.webmaker.org

  2. open .env in your favorite text editor

  3. change POSTGRES_CONNECTION_STRING to reflect your Postgres DB

  4. git add . && git commit -m ‘updating config’ && git push heroku master`
```

##**webmaker.org**
```
  1. `cd ../webmaker.org

  2. open .env in your favorite text editor

  3. change LOGIN_EMAIL_URL to your api.webmaker.org URL

  4. change MAKE_ENDPOINT to MakeAPI

  5. change AUDIENCE to your api.webmaker.org URL

  6. change LOGIN to your login.webmaker URL

  7. change LOGINAPI “http://testuser:password@<your login.webmaker URL>”

  8. save/close

  9. git add . && git commit -m ‘updating config’ && git push heroku master`
```

##**login.webmaker.org**
```
  1. `cd ../login.webmaker.org

  2. open .env in your favorite text editor

  3. change WEBMAKERORG to your webmaker.org URL

  4. change PROFILE to “.<your webmaker.org URL>” (note dot)

  5. fill in your AWS information

  6. fill in DB_URL with your MySQL db URL

  7. fill in APP_HOSTNAME with your login.webmaker.org URL

  8. fill in LOGINAPI with “http://testuser:password@”+ your login.webmaker.org URL

  8. git add . && git commit -m ‘updating config’ && git push heroku master`
```

##**sawmill**

sawmill cannot use a .env file. to set variables, run

`heroku config:set KEY=VALUE`
```
  1. `cd ../sawmill

  2. set AWS_QUEUE_REGION to your SQS queue region

  3. set INCOMING_QUEUE_URL to your incoming queue URL

  4. set OUTGOING_QUEUE_URL to your outgoing queue URL

  5. set WORKER_ARCHIVER_CONNECTION_STRING to your postgres connection URI

  6. set HATCHET_QUEUE_REGION to your SQS queue region

  7. set HATCHET_QUEUE_URL to your incoming queue URL

  8. set AWS_ACCESS_KEY_ID to your AWS access key

  9. set AWS_SECRET_ACCESS_KEY to your AWS secret

  10. git push heroku master
```

##**lumberyard**

lumberyard also cannot use a .env file
```
  1. `cd ../lumberyard

  2. set AWS_ACCESS_KEY_ID to your AWS access key

  3. set AWS_SECRET_ACCESS_KEY to your AWS secret

  4. set INCOMING_QUEUE_URL to your incoming queue URL

  5. set AWS_QUEUE_REGION to your SQS queue region

  6. set WEBMAKER_URL to your webmaker.org URL`
```

##**make-valet**

make-valet also cannot use a .env file
```
  1. `cd ../make-valet

  2. set STATIC_DATA_STORE to
   http://yourbucket.s3-website-your-region.amazonaws.com

  3. set MAKE_ENDPOINT to your MakeAPI URL

  4. set WEBMAKERORG to your webmaker.org URL

  5. git push heroku master
```

Now, you should go through each of your directories and `heroku restart`

Navigate to your popcorn.webmaker Heroku URL, and you should be good to go!
