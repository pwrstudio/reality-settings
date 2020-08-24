<script>
  import { onMount } from 'svelte'
  import random from 'lodash/random'
  import { window } from 'lodash/_freeGlobal'
  //   // PROPS
  export let index = {}

  // VARIABLES
  let transX = 0
  let transY = 0

  let docHeight = 0

  const move = (x, y) => {
    console.log('Moving:', index)
    transX = x
    transY = y
    // console.log(document.querySelector('.landing').scrollWidth)
    // console.log(document.querySelector('.landing').scrollHeight)
    setTimeout(() => {
      move(
        random(0, document.documentElement.clientWidth - 100),
        random(0, document.documentElement.clientHeight - 100)
      )
    }, random(4000, 10000))
  }

  onMount(async () => {
    // docHeight = document.documentElement.clientHeight
    // console.dir(docHeight)
    setTimeout(() => {
      move(
        random(0, document.documentElement.clientWidth - 100),
        random(0, document.documentElement.clientHeight - 100)
      )
    }, random(0, 400))
  })
</script>

<style lang="scss">
  .ball {
    width: 100px;
    height: 100px;
    border-radius: 100px;
    background: red;
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0.6;
    transition: transform 4s ease-out, opacity 0.5s ease-out;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }
</style>

<div
  class="ball"
  style={'transform: translateX(' + transX + 'px) translateY(' + transY + 'px) scale(' + random(5, 10, true) / 10 + ');'} />
