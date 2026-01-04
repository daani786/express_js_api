# express_js_api


Mongo DB Commands
- mongosh --username root --authenticationDatabase admin
Enter password: 1234
Current Mongosh Log ID: 695a15ed79d661df7f3f118b
Connecting to:          mongodb://<credentials>@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&authSource=1234&appName=mongosh+2.5.10
MongoServerError: Authentication failed.
root@704d9064d589:/# mongosh --username root --authenticationDatabase admin
Enter password: ****
Current Mongosh Log ID: 695a1600f3865726d23f118b
Connecting to:          mongodb://<credentials>@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin&appName=mongosh+2.5.10
Using MongoDB:          8.2.3
Using Mongosh:          2.5.10

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-01-04T07:20:11.966+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-01-04T07:20:11.966+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-01-04T07:20:11.966+00:00: We suggest setting the contents of sysfsFile to 0. 
------
test> show dbs
admin   100.00 KiB
config   60.00 KiB
local    72.00 KiB

test> use local
switched to db local

local> show collections
startup_log

local> db.col.find({})

local> db.col.insert({})

-------------- Access mongodb in browser
http://localhost:8081/
username = user
password = pass
