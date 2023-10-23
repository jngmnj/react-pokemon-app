import React, { useEffect } from 'react'

const DamageRelations = ({ damages }) => {
  // console.log(damages)

  useEffect(() => {
    const arrayDamage = damages.map((damage) => 
      separateObjectBetweenToAndFrom(damage)
    )
  }, [])

  const separateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations('_from', damage);
    const to = filterDamageRelations('_to', damage);

    console.log("from", from)
    console.log("from", to)
  }

  const filterDamageRelations = (valueFilter, damage) => {
    // console.log("entries:", Object.entries(damage));
    const result = Object.entries(damage)
      .filter(([keyName, value]) => {
        return keyName.includes(valueFilter); // _to와 _from으로 나눔
      })
      .reduce((acc, [keyName, value]) => {
        const keyWithValueFilterRemove = keyName.replace(
          valueFilter,
          ''
        )
        return (acc = { [keyWithValueFilterRemove]: value, ...acc });
      })
      return result;
  }

  return (
    <div>DamageRelations</div>
  )
}

export default DamageRelations