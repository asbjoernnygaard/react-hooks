// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

import {fetchPokemon, PokemonInfoFallback, PokemonDataView} from "../pokemon";
import {PokemonForm} from '../pokemon'
import {ErrorBoundary} from "react-error-boundary";

function ErrorFallback({error, resetErrorBoundary}) {
  return (<div role="alert">
    There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>click me</button>
  </div>)
}

function PokemonInfo({pokemonName}) {

  const [{pokemon, status, error}, setState] = React.useState({
    pokemon: null,
    status: pokemonName ? 'pending': 'idle',
    error: null
  })

  React.useEffect(() => {
    if (!pokemonName) return

    setState({status: 'pending'})

    fetchPokemon(pokemonName).then(
        pokemon => setState({pokemon, status: 'resolved'}),
        error => setState({error, status: 'rejected'})
    )

  }, [pokemonName])

  if (status === 'idle') return 'Submit a pokemon'
  if (status === 'pending') return <PokemonInfoFallback name={pokemonName}/>
  if (status === 'resolved') return <PokemonDataView pokemon={pokemon}/>
  if (status === 'rejected') throw error

  throw new Error('Impossible!!!!!')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
