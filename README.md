**Important:**  
This script uses `{ force: true }` in `sequelize.sync()`.  
This means **all existing tables will be dropped and recreated**.  
**All data in your database will be lost!**  
Use this only for initial setup or development, not in production.

If you want to keep your data and only update table structures, change `{ force: true }` to `{ alter: true }` in `syncModels.js`.
