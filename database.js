import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon');

export async function createTable() {
  return await db.execAsync(
          'create table if not exists menuitems (id integer primary key not null, uuid text, title text, price text, category text);'
  )
}

export async function getMenuItems() {
  try {
    const x = await db.getAllAsync('select * from menuitems')
    return x
  } catch (error) {
    Alert.alert(e.message);
    return []
  }
}

export async function saveMenuItems(menuItems) {
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

export async function filterByQueryAndCategories(query, activeCategories) {
  console.log('filterByQueryAndCategories', activeCategories)
  const cats = [...activeCategories].join("','")

  const statement = await db.prepareAsync(`select * from menuitems where category in ('${cats}') AND title like $query`)
  const result = await statement.executeAsync({ $query: `%${query}%`});
  const data = await result.getAllAsync();
  await statement.finalizeAsync();
  return data
}
