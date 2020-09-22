import { writable } from "svelte/store"

// WRITABLE
export const globalSeed = writable(0)
export const generation = writable(0)
export const epoch = writable(0)
export const authors = writable([])
export const projects = writable([])
