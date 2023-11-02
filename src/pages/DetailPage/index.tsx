import React, { useEffect, useState } from 'react';
import { Link, json, useParams } from 'react-router-dom';
import axios from 'axios';
import {Loading} from '../../assets/Loading';
import { GreaterThan } from "../../assets/GreaterThan";
import { LessThan } from "../../assets/LessThan";
import { ArrowLeft } from "../../assets/ArrowLeft";
import { Balance } from "../../assets/Balance";
import { Vector } from "../../assets/Vector";
import Type from '../../components/Type';
import BaseStat from '../../components/BaseStat';
import DamageModal from '../../components/DamageModal';
import { FormattedPokemonData } from '../../types/FormattedPokemonData';
import { Ability, PokemonDetail, Sprites, Stat } from '../../types/PokemonDetail';
import { DamageRelationsOfPokemonTypes } from '../../types/DamageRelationsOfPokemonTypes';
import { FlavorTextEntry, PokemonDescription } from '../../types/PokemonDescription';
import { PokemonData } from '../../types/PokemonData';

interface NextAndPreviousPokemon {
  next: string | undefined;
  previous: string | undefined;
}
const DetailPage = () => {
  const [pokemon, setPokemon] = useState<FormattedPokemonData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const params = useParams() as {id: string}; // 타입단언
  const pokemonId = params.id;
  const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;

  useEffect(() => {
    setIsLoading(true);
    fetchPokemonData(pokemonId);
  }, [pokemonId]);

  const fetchPokemonData = async (id: string) => {
    const url = `${baseUrl}${id}`;
    try {
      const {data: pokemonData} = await axios.get<PokemonDetail>(url);
      if(pokemonData) {
        // console.log(pokemonData)
        const { name, id, types, weight, height, stats, abilities, sprites } =
          pokemonData;
        const nextAndPreviousPokemon: NextAndPreviousPokemon = await getNextAndPreviousPokemon(id);
        // console.log("sprites", sprites)

        const DamageRelations = await Promise.all( // 비동기 작업 처리하고 한꺼번에 리턴
          types.map(async (i) => {
            const type = await axios.get<DamageRelationsOfPokemonTypes>(i.type.url);
            // console.log("DamageRelationsOfPokemonTypes",JSON.stringify(type.data))
            return type.data.damage_relations
          })
        );

        const formattedPokemonData = {
          id,
          name,
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatAbilities(abilities),
          stats: formatPokemonStats(stats),
          DamageRelations,
          types: types.map((type) => type.type.name),
          sprites: formatPokemonSprites(sprites),
          description: await getPokemonDescription(id),
        };
        // console.log("formattedPokemonData",JSON.stringify(formattedPokemonData));
        setPokemon(formattedPokemonData);
        setIsLoading(false);
      }
    } catch(error) {
      console.error(error)
      setIsLoading(false);
    }
  }

  const getNextAndPreviousPokemon = async (id: number) => {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;
    const { data: pokemonData } = await axios.get(urlPokemon);

    const nextResponse =
      pokemonData.next && (await axios.get<PokemonData>(pokemonData.next));
    const previousResponse =
      pokemonData.previous && (await axios.get<PokemonData>(pokemonData.previous));
    return {
      next: nextResponse?.data?.results[0]?.name,
      previous: previousResponse?.data?.results[0]?.name,
    };
  };

  const formatAbilities = (abilities: Ability[]) => {
    return abilities
      .filter((_, index) => index <= 1)
      .map((obj: Ability) => obj.ability.name.replaceAll("-", " "));
  };

  // console.log(pokemon?.DamageRelations);

  const formatPokemonStats = ([ // stats 배열을 구조분해할당
    statHP,
    statAttack,
    statDEP,
    statSATK,
    statSDEP,
    statSPD,
  ]: Stat[]) => [ // 배열 리턴
    { name: "Hit Points", baseStat: statHP.base_stat },
    { name: "Attack", baseStat: statAttack.base_stat },
    { name: "Defense", baseStat: statDEP.base_stat },
    { name: "Special Attack", baseStat: statSATK.base_stat },
    { name: "Special Defense", baseStat: statSDEP.base_stat },
    { name: "Speed", baseStat: statSPD.base_stat },
  ];

  const formatPokemonSprites = (sprites: Sprites) => {
    const newSprites = {...sprites};
    // console.log(Object.keys(newSprites))

    // string이 아닌 값을 가졌다면 삭제하기(url 있는것만 남기기위해)
    ((Object.keys(newSprites) as (keyof typeof newSprites)[]).forEach(key => {
      // newSprites에 키값만 가져옴(오브젝트에 키값만 가져옴)
      if(typeof newSprites[key] !== 'string') {
        delete newSprites[key]
      }
    }));  
    // console.log(newSprites);

    return Object.values(newSprites) as string[]; // url만 return
  }

  const filterAndFormatDescription = (flavorText: FlavorTextEntry[]): string [] => {
    const koreanDescriptions = flavorText
      ?.filter((text: FlavorTextEntry) => text.language.name === "ko")
      .map((text: FlavorTextEntry) =>
        text.flavor_text.replace(/\r|\n|\f/g, " ")
      );
    return koreanDescriptions;
  }

  const getPokemonDescription = async (id: number): Promise<string> => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    const {data: pokemonSpecies} = await axios.get<PokemonDescription>(url);
    // console.log("pokemonSpecies", JSON.stringify(pokemonSpecies));
    // console.log(pokemonSpecies)

    // 한국어 description필터링
    const descriptions: string[] = filterAndFormatDescription(pokemonSpecies.flavor_text_entries);
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }


  if(isLoading) {
    return (
      <div className={`absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50`}>
        <Loading className='w-12 h-12 z-50 animate-spin text-slate-900' />
      </div>

    )
  }
  
  if(!isLoading && !pokemon) return <div>Not Found...</div>

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const bg = `bg-${pokemon?.types?.[0]}`;
  const text = `text-${pokemon?.types?.[0]}`

  // pokemon && 으로 써도되지만 예시로! 
  if(!isLoading && pokemon) {
    return (
      <article className="flex items-center gap-1 flex-col w-full h-full">
        <div
          className={`${bg} w-full h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
        >
          {/* 이전, 다음 링크 버튼 */}
          {pokemon.previous && (
            <Link
              className="absolute top-[40%] -translate-y-1/2 z-50 left-1"
              to={`/pokemon/${pokemon.previous}`}
            >
              <LessThan className="w-5 h-8 p-1" />
            </Link>
          )}
          {pokemon.next && (
            <Link
              className="absolute top-[40%] -translate-y-1/2 z-50 right-1"
              to={`/pokemon/${pokemon.next}`}
            >
              <GreaterThan className="w-5 h-8 p-1" />
            </Link>
          )}

          {/* 상단 정보 */}
          <section className="w-full flex flex-col z-20 items-center justify-end relative h-full">
            <div className="absolute z-30 top-6 flex items-center w-full justify-between px-2">
              <div className="flex items-center gap-1">
                <Link to="/">
                  <ArrowLeft className="w-6 h-8 text-zinc-200" />
                </Link>
                <h1 className="text-zinc-200 font-bold text-xl capitalize">
                  {pokemon.name}
                </h1>
              </div>
              <div className="text-zinc-200 font-bold text-md">
                #{pokemon.id.toString().padStart(3, "00")}
              </div>
            </div>
            <div className="relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16">
              <img
                src={img}
                width="100%"
                height="auto"
                loading="lazy"
                alt={pokemon.name}
                className={`object-contain h-full cursor-pointer`}
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          </section>

          {/*  */}
          <section className="w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4">
            <div className="flex items-center justify-center gap-4">
              {/* 포켓몬 타입 */}
              {pokemon.types.map((type) => (
                <Type key={type} type={type} />
              ))}
            </div>

            <h2 className={`text-base font-semibold ${text}`}>정보</h2>

            <div className="flex w-full items-center justify-between max-w-[400px] text-center">
              <div className="w-full">
                <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
                <div className="text-sm flex mt-1 gap-2 justify-center  text-zinc-200">
                  <Balance />
                  {pokemon.weight}kg
                </div>
              </div>
              <div className="w-full">
                <h4 className="text-[0.5rem] text-zinc-100">Height</h4>
                <div className="text-sm flex mt-1 gap-2 justify-center  text-zinc-200">
                  <Vector />
                  {pokemon.height}m
                </div>
              </div>
              <div className="w-full">
                <h4 className="text-[0.5rem] text-zinc-100">Abilities</h4>
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability}
                    className="text-[0.5rem] text-zinc-100 capitalize"
                  >
                    {" "}
                    {ability}
                  </div>
                ))}
              </div>
            </div>

            <h2 className={`text-base font-semibold ${text}`}>기본 능력치</h2>
            <div className="w-full">
              <table className="m-auto">
                <tbody>
                  {pokemon.stats.map((stat) => (
                    <BaseStat
                      key={stat.name}
                      valueStat={stat.baseStat}
                      nameStat={stat.name}
                      type={pokemon.types[0]}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className={`text-base font-semibold ${text}`}>설명</h2>
            <p className="text-md leading-4 font-sans text-zinc-200 max-w-[30rem] text-center">
              {pokemon.description}
            </p>

            <div className="flex my-8 flex-wrap justify-center">
              {pokemon.sprites.map((url, index) => (
                <img key={index} src={url} alt="sprites" />
              ))}
            </div>
          </section>
        </div>
        {isModalOpen && (
          <DamageModal
            setIsModalOpen={setIsModalOpen}
            damages={pokemon.DamageRelations}
          />
        )}
      </article>
    );
  }
  
  return null; // 꼭 해줘야함
};

export default DetailPage;
