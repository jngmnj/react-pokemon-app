import React, { useEffect } from 'react'

const DamageRelations = ({ damages }) => {

  const [damagePokemonForm, setDamagePokemonForm] = useState();

  // console.log(damages)
  useEffect(() => {
    const arrayDamage = damages.map((damage) =>
      separateObjectBetweenToAndFrom(damage)
    );

    if (arrayDamage.length === 2) {
      // 합치는 부분
      const obj = joinDamageRelations(arrayDamage);
      // console.log(reduceDuplicateValues(postDamageValue(obj.from)));
      // reduceDuplicateValues(obj)
      setDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from)));
    } else {
      setDamagePokemonForm(postDamageValue(arrayDamage[0].from)); // 첫번째 from
    }
  }, []);

  // 1. from, to 나누기 : 각 필터링해서 담아줌
  const separateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations("_from", damage);
    const to = filterDamageRelations("_to", damage);
    // console.log("from", from)
    // console.log("to", to)
    return { from, to };
  };

  const filterDamageRelations = (valueFilter, damage) => {
    // console.log("entries:",Object.entries(damage));
    const result = Object.entries(damage)
      .filter(([keyName, value]) => {
        return keyName.includes(valueFilter); // _to와 _from으로 나눔
      })
      .reduce((acc, [keyName, value]) => {
        // reduce는 return해서 acc 메소드에 하나씩 쌓아줌
        // console.log(acc, [keyName, value]);
        // _from, _to 삭제
        const keyWithValueFilterRemove = keyName.replace(valueFilter, "");
        return (acc = { [keyWithValueFilterRemove]: value, ...acc });
      }, {}); // acc의 초기값 빈객체
    return result;
  };

  // 2-1. 한개일때: 데미지값 넣어주기
  const postDamageValue = (props) => {
    const result = Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName;
      const valueOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };

      // 데미지값 각 객체마다 넣기
      return (acc = {
        [keyName]: value.map((i) => ({
          damageValue: valueOfKeyName[key],
          ...i,
        })),
        ...acc
      });
    }, {});
    // console.log(result);
    return result;
  };

  // 2-2. 두개일때: 합치기
  const joinDamageRelations = (props) => {
    return {
      to: joinObjects(props, 'to'),
      from: joinObjects(props, 'from'),
    }
  }

  // (합치기 메서드)
  const joinObjects = (props, string) => {
    const key = string;
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];

    // firstArrayValue에 secondArrayValue를 합치기
    const result = Object.entries(secondArrayValue).reduce(
      (acc, [keyName, value]) => {
        // console.log("ddd", acc, [keyName, value]);
        const result = firstArrayValue[keyName].concat(value); // 첫번째 array value에 해당하는 데미지에 합침
        return (acc = { [keyName]: result, ...acc });
      },
      {}
    );
    return result;
  }

  // 중복 속성 데미지값 배로 처리
  const reduceDuplicateValues = (props) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };
    // console.log(props)

    // console.log("object", Object.entries(props));
    return Object.entries(props)
      .reduce((acc, [keyName, value]) => {
        const key = keyName;
        // console.log("키밸류",[keyName, value]);
        const verifiedValue = filterForUniqueValues(
            value, 
            duplicateValues[key]
          );

        return (acc = {
          [keyName]: verifiedValue,
          ...acc,
        });
      }, {});
  }

  const filterForUniqueValues = (valueForFiltering, damageValue) => {
    return valueForFiltering.reduce((acc, currentValue) => {
      const {url, name} = currentValue;
      const filterACC = acc.filter((a) => a.name !== name); // name이 같지 않은것만 넣어두기
      
      return filterACC.length === acc.length 
      ? (acc = [currentValue, ...acc]) // 변경 없으면(중복없으면) currentvalue그대로 넣기
      : (acc = [{damageValue: damageValue, name, url}, filterACC]) // 같은것은 데미지밸류 변경
    }, []);
  }
  
  return <div>DamageRelations</div>;
}

export default DamageRelations