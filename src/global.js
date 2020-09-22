export const STATE = {
  ERROR: 0,
  GAME: 1,
  PROJECTS: 2,
  META: 3,
  SINGLE_PROJECT: 4,
  SINGLE_AUTHOR: 5,
}

export const MILLISECONDS_PER_GENERATION = 50
export const EPOCH_LENGTH = 8

export const WORLD = {
  HEIGHT: 31,
  WIDTH: 31,
  SIZE: 31 * 31,
}

export const QUERY = {
  ALL:
    "*[_type in ['introduction', 'project', 'author']]{...,authors[]->{...}}",
  PROJECT: '*[_type == "project"]{...,authors[]->{...}}',
  AUTHOR: '*[_type == "author"]',
  META: '*[_id == "introduction"]{...,authors[]->{...}}[0]',
  CONNECTED_PROJECTS:
    '*[_type == "project" && authors[]._ref == $id]{...,authors[]->{...}}',
}

export const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const listToMatrix = (list, elementsPerSubArray) => {
  var matrix = [],
    i,
    k

  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++
      matrix[k] = []
    }
    matrix[k].push(list[i])
  }

  return matrix
}

export const padGen = (number) =>
  number <= 99999 ? `0000${number}`.slice(-5) : number
