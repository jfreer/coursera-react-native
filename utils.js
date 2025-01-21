import { useRef, useEffect } from 'react';

export function getSectionListData(data) {
  console.log('getSectionListData')

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  const menus = {}
  data.forEach(val => {
     if (!menus[val.category]) {
       menus[val.category] = {
         title: val.category,
         data: []
       }
     }
     menus[val.category] = {
       title: val.category,
       data: menus[val.category].data.concat({id: val.id, title: val.title, price: val.price})
     }
  })
  const menu = Object.values(menus)

  return menu;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, [...dependencies]);
}
