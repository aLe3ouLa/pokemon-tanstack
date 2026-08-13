import { keepPreviousData, queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToTeam, getTeam, removeFromTeam } from "./utils";

const teamQueryOptions = queryOptions({
  queryKey: ['team'],
  queryFn: getTeam
})

export const useTeam = () => useQuery(teamQueryOptions)

export const usePokemon = (pokemonName: string) => useQuery({
    queryKey: ['pokemon', pokemonName],
    queryFn: () => {
      return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Pokemon not found")
          }
        })
    },
    enabled: !!pokemonName,
    placeholderData: keepPreviousData
  });

export const useAddToTeam = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
    mutationFn: addToTeam,
    onMutate: async (pokemonName) => {
      await queryClient.cancelQueries({ queryKey: teamQueryOptions.queryKey })
      const previousTeam = queryClient.getQueryData(teamQueryOptions.queryKey) as Array<string>
      queryClient.setQueryData(teamQueryOptions.queryKey, (old) => [...old, pokemonName])
      return { previousTeam };
    },
    onError: (err, variable, context) => {
      return queryClient.setQueryData(teamQueryOptions.queryKey, context?.previousTeam || [])
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: teamQueryOptions.queryKey})
    }
    
  })
}

export const useDeleteFromTeam = () => {
     const queryClient = useQueryClient();
    return useMutation({
    mutationFn: removeFromTeam,
     onMutate: async (pokemonName) => {
      await queryClient.cancelQueries({ queryKey: teamQueryOptions.queryKey })
      const previousTeam = queryClient.getQueryData(teamQueryOptions.queryKey) as Array<string>
      queryClient.setQueryData(teamQueryOptions.queryKey, (old) => old.filter(pok => pok !== pokemonName))
      return { previousTeam };
    },
    onError: (err, variable, context) => {
      return queryClient.setQueryData(teamQueryOptions.queryKey, context?.previousTeam || [])
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: teamQueryOptions.queryKey })
    }
  })
}