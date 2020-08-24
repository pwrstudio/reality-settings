import { writable } from 'svelte/store'

// WRITABLE
export const running = writable(false)
export const globalSeed = writable(0)
export const generation = writable(0)
export const globalHeat = writable(50)