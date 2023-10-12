import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const DetailPage = () => {
  const [pokemon, setPokemon] = useState([]);

  const params = useParams();

  useEffect(() => {
    fetchPokemonData()
    console.log(pokemon)
  }, [])

  async function fetchPokemonData() {
    const url = `https://pokeapi.co/api/v2/pokemon/${params.id}`;
    try {
      const {data: pokemonData} = await axios.get(url);
      if(pokemonData) {
        const {name, id, types, height, stats, abilities } = pokemonData;
        +
        -
      }

      setPokemon(pokemonData)
    } catch (error) {
      console.error(error)
    }
  }



  return (
    <div>DetailPage</div>
  )
}

export default DetailPage