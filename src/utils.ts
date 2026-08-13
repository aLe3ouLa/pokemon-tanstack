export const getTeam = () => {
  const myTeam = localStorage.getItem("myTeam");
  return Promise.resolve(myTeam ? JSON.parse(myTeam) : []);
}

export const addToTeam = ((pokemonName: string) => {
  const myTeam = localStorage.getItem("myTeam");
  const team = myTeam ? JSON.parse(myTeam) : [];
  team.push(pokemonName);
  localStorage.setItem("myTeam", JSON.stringify(team))
  return Promise.resolve(team)
})

export const removeFromTeam = (pokemonName: string) => {
  const myTeam = localStorage.getItem("myTeam");
  const team = myTeam ? JSON.parse(myTeam) : [];

  const filtered = team.filter((pokemon) => pokemon !== pokemonName)
  localStorage.setItem("myTeam", JSON.stringify(filtered))

  return Promise.resolve(filtered)
}