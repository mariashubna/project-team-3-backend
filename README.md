## How to Create Tables in Database

**Important:**  
This script uses `{ force: true }` in `sequelize.sync()`.  
This means **all existing tables will be dropped and recreated**.  
**All data in your database will be lost!**  
Use this only for initial setup or development, not in production.

If you want to keep your data and only update table structures, change `{ force: true }` to `{ alter: true }` in `syncModels.js`.

```
node db/utils/syncModels.js
```

## How to Seed the Database with Initial Data

**Important:**  
This script will remove all existing data and re-insert everything from the JSON files.  
Use this only for initial setup or development, not in production.

To populate your database with initial data from the JSON files in `db/data`, run the following command from your project root:

```
node db/utils/seed.js
```
