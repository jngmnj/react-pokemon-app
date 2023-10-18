import React, { useEffect, useState } from "react";
import axios from "axios";
import LazyImage from "./LazyImage";
import { Link } from "react-router-dom";

const PokeCard = ({ url, name }) => {
  const [pokemon, setPokemon] = useState();

  useEffect(() => {
    fetchPokeDetailData();
  }, []);

  const fetchPokeDetailData = async () => {
    try {
      const response = await axios.get(url);
      // console.log(response.data);
      const pokemonData = formatPokeData(response.data);
      setPokemon(pokemonData);
    } catch (error) {
      console.error(error);
    }
  };

  const formatPokeData = (params) => {
    const { id, types, name } = params;
    const PokeData = {
      id,
      name,
      type: types[0].type.name,
    };
    return PokeData;
  };

  const bg = `bg-${pokemon?.type}`;
  const border = `border-${pokemon?.type}`;
  const text = `text-${pokemon?.type}`;
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  
  return (
    <>
      {pokemon && (
        <Link
          to={`/pokemon/${name}`}
          className={`box-border rounded-lg ${border} w-[8.5rem] h-[8.5rem] z-0 bg-slate-800 justify-content`}
        >
          <div
            className={`${text} h-[1.5rem] text-xs w-full pt-1 px-2 text-right rounded-t-lg`}
          >
            #{pokemon.id.toString().padStart(3, "00")}
          </div>
          <div className={`w-full f-6 items-center justify-center`}>
            <div
              className={`box-border relative flex w-full h-[5.5rem] basis justify-center items-center`}
            >
              <LazyImage
                src={img}
                alt={name}
              />
            </div>
            <div
              className={`${bg} text-center text-xs text-zinc-100 h-[1.5rem] rounded-b-lg uppercase font-medium  pt-1`}
            >
              {pokemon.name}
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default PokeCard;
