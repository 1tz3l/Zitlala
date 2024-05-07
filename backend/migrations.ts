export type MigrationItem = {
  queries: string[];
};

export const migrations = new Map<string, MigrationItem>();

/*
 * Migration name format: YYYY-MM-DD_HHMM_migration_name
 */

/*
 * Migration to create the users table.
 */
migrations.set("2024-05-04_1156_create_users_table", {
  queries: ["CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT);"],
});

/*
 * Migration to create the contacts table.
 */

migrations.set("2024-05-04_1159_create_contacts_table", {
  queries: ["CREATE TABLE contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT);"],
});


/* Migration to create furniture table */

/*migrations.set("2024-05-04_1200_create_furniture_table", {
  queries: ["CREATE TABLE furniture (id INTEGER PRIMARY KEY AUTOINCREMENT, background BLOB, window BLOB, bookcase BLOB, bed BLOB, chair BLOB, TableItem BLOB;"],
});


/* 
*Migration to create clothes table 
*/

/*migrations.set("2024-05-04_1202_create_clothes_table", {
  queries: ["CREATE TABLE clothes (id INTEGER PRIMARY KEY AUTOINCREMENT, head BLOB, ears BLOB, back BLOB, chest BLOB, shoes BLOB, mouth BLOB, butt BLOB;"],
});

/*
* Migration to create food table
*/

/*migrations.set("2024-05-04_1203_create_food_table", {
  queries: ["CREATE TABLE food (id INTEGER PRIMARY KEY AUTOINCREMENT, fruit BLOB, vegetable BLOB, meat BLOB, desser BLOB, drink BLOB;"],
});


/*
* Migrations to create relational table (items) to store the id of the furniture, clothes, food and users
*/

/*migrations.set("2024-05-04_1201_create_items_table", {
  queries: ["CREATE TABLE items (id INTEGER PRIMARY KEY AUTOINCREMENT, IdFurniture INTEGER, FOREING KEY(IdFurniture) REFERENCES furniture(id), IdClothes Integer, FOREING KEY(IdClothes) REFERENCES clothes(id), IdFood INTEGER, FOREING KEY(IdFood) REFERENCES food(id), IdUser INTEGER, FOREING KEY(IdUser) REFERENCES users(id);"],
});

/*
* Migration to create store table and related to items
*/
//migrations.set("2024-05-04_1204_create_store_table", {
 // queries: ["CREATE TABLE store (id INTEGER PRIMARY KEY AUTOINCREMENT, IdItems INTEGER, FOREING KEY(IdItems) REFERENCES items(id);"],
//});