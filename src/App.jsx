import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const url = 'https://pokeapi.co/api/v2/pokemon/?limit=100&offset=0';

  useEffect(() => {
    fetchPokeData();
  }, []);
  
  const fetchPokeData = async () => {
    try {
      const response = await axios.get(url);
      console.log(response);
      setPokemons(response.data.results);
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <article className="pt-6">
      <header className="flex flex-col gap-2 w-full px-4 z-50">
      </header>
      <section className="pt-6 flex flex-col justify-content items-center overflow-auto z-0">
        {pokemons.length > 0 ? (
          pokemons.map((pokemon, index) => (
            // <PokemonCard key={pokemon.id} pokemon={pokemon} />
            <div key={index} pokemon={pokemon}>{pokemon.name}</div>

          ))
        ): (
            <h2 className="font-medium text-lg text-slate-900 mb-1">
              포켓몬이 없습니다.
            </h2>
        )}
        {/* <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl ">
          {displayedPokemons.length > 0 ? (
            displayedPokemons.map(({ url, name }: PokemonNameAndUrl) => (
              <PokeCard key={url} url={url} name={name} />
            ))
          ) : (
            <h2 className="font-medium text-lg text-slate-900 mb-1">
              포켓몬이 없습니다.
            </h2>
          )}
        </div> */}
      </section>
      {/* <div className="text-center">
        {allPokemons.length > displayedPokemons.length &&
          displayedPokemons.length > limitNum && (
            <button
              onClick={() =>
                setDisplayedPokemons(
                  filterDisplayedPokemonData(allPokemons, displayedPokemons)
                )
              }
              className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
            >
              더 보기
            </button>
          )}
      </div> */}
    </article>
  );
}

export default App
