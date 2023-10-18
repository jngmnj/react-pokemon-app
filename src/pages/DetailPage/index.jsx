import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const params = useParams();
  const pokemonId = params.id;
  const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;

  useEffect(() => {
    fetchPokemonData()
  }, []);

  const fetchPokemonData = async () => {
    const url = `${baseUrl}${pokemonId}`;
    try {
      const {data: pokemonData} = await axios.get(url);
      console.log(pokemonData);
      // next, prev pokemon정보: id만 있으면되지않나? 
      if(pokemonData) {
        const { name, id, types, weight, height, stats, abilities } =
          pokemonData;
        const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);

        const formattedPokemonData = {
          id,
          name,
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formattedAbilities(abilities),
        }


      }
    } catch(error) {
      console.error(error)
    }
  }

  const getNextAndPreviousPokemon = async (id) => {
    console.log("id",id)
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;
    const { data: pokemonData } = await axios.get(urlPokemon);
    console.log("getnextandprev...",pokemonData);

    const nextResponse =
      pokemonData.next && (await axios.get(pokemonData.next));
    const previousResponse =
      pokemonData.previous && (await axios.get(pokemonData.previous));
    return {
      next: nextResponse?.data?.results[0]?.name,
      previous: previousResponse?.data?.results[0]?.name,
    };
  };

  const formattedAbilities = (abilities) => {
    return abilities
      .filter((_, index) => index <= 1)
      .map((obj) => obj.ability.name.replaceAll("-", " "));
  };


  return (
    // <article className="flex items-center gap-1 flex-col w-full">
    //   <div
    //     className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
    //   >
    //     {pokemon.previous && (
    //       <Link
    //         className="absolute top-[40%] -translate-y-1/2 z-50 left-1"
    //         to={`/pokemon/${pokemon.previous}`}
    //       >
    //         <LessThan className="w-5 h-8 p-1" />
    //       </Link>
    //     )}

    //     {pokemon.next && (
    //       <Link
    //         className="absolute top-[40%] -translate-y-1/2 z-50 right-1"
    //         to={`/pokemon/${pokemon.next}`}
    //       >
    //         <GreaterThan className="w-5 h-8 p-1" />
    //       </Link>
    //     )}

    //     <section className="w-full flex flex-col z-20 items-center justify-end relative h-full">
    //       <div className="absolute z-30 top-6 flex items-center w-full justify-between px-2">
    //         <div className="flex items-center gap-1">
    //           <Link to="/">
    //             <ArrowLeft className="w-6 h-8 text-zinc-200" />
    //           </Link>
    //           <h1 className="text-zinc-200 font-bold text-xl capitalize">
    //             {pokemon.name}
    //           </h1>
    //         </div>
    //         <div className="text-zinc-200 font-bold text-md">
    //           #{pokemon.id.toString().padStart(3, "00")}
    //         </div>
    //       </div>

    //       <div className="relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16">
    //         <img
    //           src={img}
    //           width="100%"
    //           height="auto"
    //           loading="lazy"
    //           alt={pokemon.name}
    //           className={`object-contain h-full cursor-pointer`}
    //           onClick={() => setIsModalOpen(true)}
    //         />
    //       </div>
    //     </section>

    //     <section className="w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4">
    //       <div className="flex items-center justify-center gap-4">
    //         {/* 포켓몬 타입 */}
    //         {pokemon.types.map((type) => (
    //           <Type key={type} type={type} />
    //         ))}
    //       </div>

    //       <h2 className={`text-base font-semibold ${text}`}>정보</h2>

    //       <div className="flex w-full items-center justify-between max-w-[400px] text-center">
    //         <div className="w-full">
    //           <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
    //           <div className="text-sm flex mt-1 gap-2 justify-center  text-zinc-200">
    //             <Balance />
    //             {pokemon.weight}kg
    //           </div>
    //         </div>
    //         <div className="w-full">
    //           <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
    //           <div className="text-sm flex mt-1 gap-2 justify-center  text-zinc-200">
    //             <Vector />
    //             {pokemon.height}m
    //           </div>
    //         </div>
    //         <div className="w-full">
    //           <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
    //           {pokemon.abilities.map((ability) => (
    //             <div
    //               key={ability}
    //               className="text-[0.5rem] text-zinc-100 capitalize"
    //             >
    //               {" "}
    //               {ability}
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //       <h2 className={`text-base font-semibold ${text}`}>기본 능력치</h2>
    //       <div className="w-full">
    //         <table>
    //           <tbody>
    //             {pokemon.stats.map((stat) => (
    //               <BaseStat
    //                 key={stat.name}
    //                 valueStat={stat.baseStat}
    //                 nameStat={stat.name}
    //                 type={pokemon.types[0]}
    //               />
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>

    //       <h2 className={`text-base font-semibold ${text}`}>설명</h2>
    //       <p className="text-md leading-4 font-sans text-zinc-200 max-w-[30rem] text-center">
    //         {pokemon.description}
    //       </p>

    //       <div className="flex my-8 flex-wrap justify-center">
    //         {pokemon.sprites.map((url, index) => (
    //           <img key={index} src={url} alt="sprite" />
    //         ))}
    //       </div>
    //     </section>
    //   </div>
    //   {isModalOpen && (
    //     <DamageModal
    //       setIsModalOpen={setIsModalOpen}
    //       damages={pokemon.DamageRelations}
    //     />
    //   )}
    // </article>
    <div></div>
  );
};

export default DetailPage;
