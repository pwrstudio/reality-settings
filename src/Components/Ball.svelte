<script>
  import { onMount } from "svelte";
  import random from "lodash/random";
  import { window } from "lodash/_freeGlobal";
  import { navigate } from "svelte-routing";

  //   // PROPS
  export let index = {};
  export let project = {};

  // VARIABLES
  let transX = document.documentElement.clientWidth / 2;
  let transY = document.documentElement.clientHeight / 2;
  let scaleFactor = 0.3;

  import { globalSeed, globalHeat } from "../stores.js";

  // let docHeight = 0

  const move = (x, y, f) => {
    // console.log('Moving:', index)
    transX = x;
    transY = y;
    scaleFactor = f;
    // console.log(document.querySelector('.landing').scrollWidth)
    // console.log(document.querySelector('.landing').scrollHeight)
    setTimeout(() => {
      move(
        random(0, document.documentElement.clientWidth - 100),
        random(0, document.documentElement.clientHeight - 100),
        random(5, 10, true) / 10
      );
    }, random(4000, 10000));
  };

  onMount(async () => {
    // docHeight = document.documentElement.clientHeight
    // console.dir(docHeight)
    // setTimeout(() => {

    // transX = document.documentElement.clientWidth / 2
    // transY = document.documentElement.clientHeight / 2

    move(
      random(0, document.documentElement.clientWidth - 100),
      random(0, document.documentElement.clientHeight - 100),
      random(5, 10, true) / 10
    );
    // }, random(0, 400))
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .ball {
    width: 100px;
    height: 100px;
    border-radius: 100px;
    background: orangered;
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0.7;
    transition: transform 4s $transtion2, opacity 0.5s $transtion2;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }
</style>

<div
  class="ball"
  on:click={e => {
    navigate('/project/' + project.slug.current);
  }}
  style={'transform: translateX(' + transX + 'px) translateY(' + transY + 'px) scale(' + scaleFactor + ');'} />
