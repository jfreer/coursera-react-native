import * as SQLite from 'expo-sqlite';
import { SECTION_LIST_MOCK_DATA } from './utils';

const db = SQLite.openDatabaseSync('little_lemon');

export async function createTable() {
  return await db.execAsync(
          'create table if not exists menuitems (id integer primary key not null, uuid text, title text, price text, category text);'
  )
}

export async function getMenuItems() {
  try {
    const x = await db.getAllAsync('select * from menuitems')
    console.log('x',x)
    return x
  } catch (error) {
    Alert.alert(e.message);
    return []
  }
}

export async function saveMenuItems(menuItems) {
  console.log('c', menuItems)
  //return []
  const statement = await db.prepareAsync(
  'INSERT INTO menuitems (uuid, title, price, category) VALUES ($uuid, $title, $price, $category)'
);
try {
  for (let i =0; i< menuItems.length; i++) {
    const val = menuItems[i]
await statement.executeAsync({ $uuid: val.id, $title: val.title, $price: val.price, $category: val.category });
  }

} finally {
  await statement.finalizeAsync();
}
}

/**
 * 4. Implement a transaction that executes a SQL statement to filter the menu by 2 criteria:
 * a query string and a list of categories.
 *
 * The query string should be matched against the menu item titles to see if it's a substring.
 * For example, if there are 4 items in the database with titles: 'pizza, 'pasta', 'french fries' and 'salad'
 * the query 'a' should return 'pizza' 'pasta' and 'salad', but not 'french fries'
 * since the latter does not contain any 'a' substring anywhere in the sequence of characters.
 *
 * The activeCategories parameter represents an array of selected 'categories' from the filter component
 * All results should belong to an active category to be retrieved.
 * For instance, if 'pizza' and 'pasta' belong to the 'Main Dishes' category and 'french fries' and 'salad' to the 'Sides' category,
 * a value of ['Main Dishes'] for active categories should return  only'pizza' and 'pasta'
 *
 * Finally, the SQL statement must support filtering by both criteria at the same time.
 * That means if the query is 'a' and the active category 'Main Dishes', the SQL statement should return only 'pizza' and 'pasta'
 * 'french fries' is excluded because it's part of a different category and 'salad' is excluded due to the same reason,
 * even though the query 'a' it's a substring of 'salad', so the combination of the two filters should be linked with the AND keyword
 *
 */
export async function filterByQueryAndCategories(query, activeCategories) {
  const cats = [...activeCategories].join("','")
  console.log(cats)
  const data = await db.getAllAsync(`select * from menuitems where category in ('${cats}')`)// AND title like '%?%'`, query)
  console.log('filter', data)
  return data
}
