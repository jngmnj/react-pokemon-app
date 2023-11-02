import React, { useEffect, useState } from "react";
import Type from "./Type";
import { DamageRelations as DamageRelationsProps } from "../types/DamageRelationsOfPokemonTypes";
import { Damage, DamageFromAndTo, SeparateDamages } from "../types/SeparateDamageRelations";

interface DamageModalProps {
  damages: DamageRelationsProps[];
}

interface Info {
  name: string;
  url: string;
}

const DamageRelations = ({ damages }: DamageModalProps) => {
  const [damagePokemonForm, setDamagePokemonForm] = useState<SeparateDamages>();

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
      // console.log("@@@@", JSON.stringify(postDamageValue(arrayDamage[0].from))); // quick type
      setDamagePokemonForm(postDamageValue(arrayDamage[0].from)); // 첫번째 from
    }
  }, []);

  // 1. from, to 나누기 : 각 필터링해서 담아줌
  const separateObjectBetweenToAndFrom = (damage: DamageRelationsProps): DamageFromAndTo => {
    const from = filterDamageRelations("_from", damage);
    const to = filterDamageRelations("_to", damage);
    // console.log("from", from)
    // console.log("to", to)
    return { from, to };
  };

  const filterDamageRelations = (valueFilter: string, damage: DamageRelationsProps) => {
    // console.log("entries:",Object.entries(damage));
    const result: SeparateDamages = Object.entries(damage)
      .filter(([keyName, _]) => {
        return keyName.includes(valueFilter); // _to와 _from으로 나눔
      })
      .reduce((acc, [keyName, value]): SeparateDamages => {
        // reduce는 return해서 acc 메소드에 하나씩 쌓아줌
        // console.log(acc, [keyName, value]);
        // _from, _to 삭제
        const keyWithValueFilterRemove = keyName.replace(valueFilter, "");
        return (acc = { [keyWithValueFilterRemove]: value, ...acc });
      }, {}); // acc의 초기값 빈객체
    return result;
  };

  // 2-1. 한개일때: 데미지값 넣어주기
  const postDamageValue = (props: SeparateDamages): SeparateDamages => {
    const result = Object.entries(props)
      .reduce((acc, [keyName, value]) => {
        const key = keyName as keyof typeof props;
        const valueOfKeyName = {
          double_damage: "2x",
          half_damage: "1/2x",
          no_damage: "0x",
        };

        // 데미지값 각 객체마다 넣기
        return (acc = {
          [keyName]: value.map((i: Info[]) => ({
            damageValue: valueOfKeyName[key],
            ...i,
          })),
          ...acc,
        });
      }, {});
    // console.log(result);
    return result;
  };

  // 2-2. 두개일때: 합치기
  const joinDamageRelations = (props: DamageFromAndTo[]): DamageFromAndTo => {
    return {
      to: joinObjects(props, "to"),
      from: joinObjects(props, "from"),
    };
  };

  // (합치기 메서드)
  const joinObjects = (props: DamageFromAndTo[], string: string) => {
    const key = string as keyof typeof props[0];
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];

    // firstArrayValue에 secondArrayValue를 합치기
    const result = Object.entries(secondArrayValue).reduce(
      (acc, [keyName, value]: [string, Damage]) => {
        // console.log("ddd", acc, [keyName, value]);
        const key = keyName as keyof typeof firstArrayValue;
        const result = firstArrayValue[key]?.concat(value); // 첫번째 array value에 해당하는 데미지에 합침
        return (acc = { [keyName]: result, ...acc });
      },
      {}
    );
    return result;
  };

  // 중복 속성 데미지값 배로 처리
  const reduceDuplicateValues = (props: SeparateDamages) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };
    // console.log(props)

    // console.log("object", Object.entries(props));
    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName as keyof typeof props;
      // console.log("키밸류",[keyName, value]);
      const verifiedValue = filterForUniqueValues(value, duplicateValues[key]);

      return (acc = {
        [keyName]: verifiedValue,
        ...acc,
      });
    }, {});
  };

  const filterForUniqueValues = (valueForFiltering: Damage[], damageValue: string) => {
    const initialArray:Damage[] = []; // 빈배열에 타입주기

    return valueForFiltering.reduce((acc, currentValue) => {
      const { url, name } = currentValue;
      const filterACC = acc.filter((a) => a.name !== name);

      return filterACC.length === acc.length
        ? (acc = [currentValue, ...acc]) // 변경 없으면(중복없으면) currentvalue그대로 넣기
        : (acc = [{ damageValue: damageValue, name, url }, ...filterACC]); // 같은것은 데미지밸류 변경
    }, initialArray); // 초기값이 빈배열이면 에러가남 
  };

  return (
    <div className="flex gap-2 flex-col">
      {damagePokemonForm ? (
        <>
          {Object.entries(damagePokemonForm).map(([keyName, value]: [string, Damage[]]) => {
            const key = keyName as keyof typeof damagePokemonForm;
            const valuesOfKeyName = {
              double_damage: "Weak",
              half_damage: "Resistant",
              no_damage: "Immune",
            };

            return (
              <div key={key}>
                <h3 className="capitalize font-medium text-sm md:text-base text-slate-500 text-center">
                  {valuesOfKeyName[key]}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center">
                  {value.length > 0 ? (
                    value.map(({ name, url, damageValue }) => (
                      <Type key={url} type={name} damageValue={damageValue} />
                    ))
                  ) : (
                    <Type key={"none"} type={"none"} />
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div>데미지 정보가 없습니다.</div>
      )}
    </div>
  );
};

export default DamageRelations