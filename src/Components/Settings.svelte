<script>
  import { links, navigate } from "svelte-routing";
  import random from "lodash/random";
  import has from "lodash/has";
  import shuffle from "lodash/shuffle";
  import flatMap from "lodash/flatMap";
  import md5 from "blueimp-md5";

  import {
    urlFor,
    loadData,
    renderBlockText,
    toPlainText,
    singleToPlainText
  } from "../sanity.js";

  let heat = 0;
  let size = 50;
  let friction = 30;
  let salt = 5;
  let seed = random(0, 65535);
  let seedArray = [];

  $: {
    let seedToBits = (seed >>> 0).toString(2);
    // console.dir(seedToBits);
    // console.dir(seedToBits.length);

    while (seedToBits.length < 16) {
      seedToBits = seedToBits + "0";
    }

    seedArray = seedToBits;
  }
  // let fillColor = "#ff0000";

  // let parameterA = 50;
  // let parameterB = 50;
  // let parameterC = 50;

  // $: {
  //   seed = md5(
  //     parameterA.toString() + parameterB.toString() + parameterC.toString()
  //   );
  // }

  // const mapRange = (x, in_min, in_max, out_min, out_max) =>
  //   ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;

  // console.log(parseInt("0xFFFFFF", 16));

  // $: {
  //   // console.log(mapRange(heat, 0, 1000, 0, 16000000).toString(16));
  //   fillColor = "#" + mapRange(heat, 0, 1000, 0, 16000000).toString(16);
  //   console.log(fillColor);
  // }

  // return (dec >>> 0).toString(2);

  const padToFour = number =>
    number <= 9999 ? `000${number}`.slice(-4) : number;

  const padToTwo = number =>
    number <= 9999 ? `00000${number}`.slice(-5) : number;

  const padToSixteen = number =>
    number <= 999999999999 ? `000000000000000${number}`.slice(-16) : number;
</script>

<style lang="scss">
  @import "../variables.scss";

  .settings {
    padding: 40px;
    font-size: 32px;

    @include screen-size("small") {
      font-size: 16px;
    }

    .header {
      font-family: "five", "Akkurat-Mono", monospace;
      font-size: 72px;
      margin-bottom: 40px;
      text-align: center;

      @include screen-size("small") {
        font-size: 48px;
        margin-bottom: 40px;
      }
    }

    .parameter {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      // position: fixed;
      // width: 50vw;

      .label {
        // background: red;
        display: inline-block;
        @include screen-size("small") {
          display: none;
        }
      }

      .preview {
        // background: red;
        display: inline-block;
        @include screen-size("small") {
          display: none;
        }
      }

      // &.top {
      //   top: 20px;
      //   left: 20px;
      //   background: yellow;
      // }

      // &.left {
      //   top: 80px;
      //   left: calc(50vw + 20px);
      //   transform-origin: top left;
      //   transform: rotateZ(90deg);
      //   background: blue;
      // }

      // &.right {
      //   background: green;
      // }

      // &.bottom {
      //   top: calc(50vw + 60px);
      //   left: 20px;
      //   background: red;
      // }
    }

    input {
      width: 100%;
      display: block;
      margin-right: 20px;
      margin-left: 20px;
    }

    .run {
      cursor: pointer;
      outline: 0;
      border: 0;
      background: white;
      text-decoration: none;
      color: #222222;
      padding: 10px 40px;
      margin-top: 40px;
      width: 100%;
      display: block;
      text-align: center;
      transition: background 0.5s $transtion2;
      border-radius: 5px;

      &:hover {
        background: lightgray;
      }
    }
  }

  .sigil {
    width: 400px;
    height: 400px;

    background: grey;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 80px;
    @include screen-size("small") {
      width: 200px;
      height: 200px;
      margin-bottom: 40px;
    }
  }

  .cell {
    height: 100px;
    width: 100px;
    border-radius: 100px;
    line-height: 100px;

    @include screen-size("small") {
      height: 50px;
      width: 50px;
      border-radius: 50px;
      line-height: 50px;
    }

    // display: inline-block;
    float: left;
    background: #c4c4c4;
    background: #a4a4a4;
    font-size: 2px;
    text-align: center;
    color: #333333;
    // display: inline-block;
    // transform: rotateZ(45deg);
    // background: green;
    // background: #00ff00;

    // &:nth-child(even) {
    //   background: #848484;
    //   background: #c4c4c4;
    //   // background: #00ff00;
    // }
    transition: none;

    .text {
      display: none;
    }

    &.alive {
      border-radius: 25px;

      // transition: background 0.3s ease-out;
      background: red;
      // transform: rotateZ(90deg);
    }
  }

  // Styling Cross-Browser Compatible Range Inputs with Sass
  // Github: https://github.com/darlanrod/input-range-sass
  // Author: Darlan Rod https://github.com/darlanrod
  // Version 1.5.2
  // MIT License

  $track-color: #333333 !default;
  $thumb-color: #ff0000 !default;

  $thumb-radius: 40px !default;
  $thumb-height: 40px !default;
  $thumb-width: 40px !default;
  $thumb-shadow-size: 0px !default;
  $thumb-shadow-blur: 0px !default;
  $thumb-shadow-color: rgba(0, 0, 0, 0) !default;
  $thumb-border-width: 0px !default;
  $thumb-border-color: #eceff1 !default;

  $track-width: 100% !default;
  $track-height: 6px !default;
  $track-shadow-size: 0px !default;
  $track-shadow-blur: 0px !default;
  $track-shadow-color: rgba(0, 0, 0, 0) !default;
  $track-border-width: 0px !default;
  $track-border-color: #cfd8dc !default;

  $track-radius: 0px !default;
  $contrast: 5% !default;

  $ie-bottom-track-color: darken($track-color, $contrast) !default;

  @mixin shadow($shadow-size, $shadow-blur, $shadow-color) {
    box-shadow: $shadow-size $shadow-size $shadow-blur $shadow-color,
      0 0 $shadow-size lighten($shadow-color, 5%);
  }

  @mixin track {
    cursor: default;
    height: $track-height;
    transition: all 0.2s ease;
    width: $track-width;
  }

  @mixin thumb {
    // @include shadow(
    //   $thumb-shadow-size,
    //   $thumb-shadow-blur,
    //   $thumb-shadow-color
    // );
    background: $thumb-color;
    border: $thumb-border-width solid $thumb-border-color;
    border-radius: $thumb-radius;
    box-sizing: border-box;
    cursor: default;
    height: $thumb-height;
    width: $thumb-width;
  }

  [type="range"] {
    -webkit-appearance: none;
    background: transparent;
    margin: $thumb-height / 2 0;
    width: $track-width;

    &::-moz-focus-outer {
      border: 0;
    }

    &:focus {
      outline: 0;

      &::-webkit-slider-runnable-track {
        background: lighten($track-color, $contrast);
      }

      &::-ms-fill-lower {
        background: $track-color;
      }

      &::-ms-fill-upper {
        background: lighten($track-color, $contrast);
      }
    }

    &::-webkit-slider-runnable-track {
      @include track;
      @include shadow(
        $track-shadow-size,
        $track-shadow-blur,
        $track-shadow-color
      );
      background: $track-color;
      border: $track-border-width solid $track-border-color;
      border-radius: $track-radius;
    }

    &::-webkit-slider-thumb {
      @include thumb;
      -webkit-appearance: none;
      margin-top: (
        (-$track-border-width * 2 + $track-height) / 2 - $thumb-height / 2
      );
    }

    &::-moz-range-track {
      @include shadow(
        $track-shadow-size,
        $track-shadow-blur,
        $track-shadow-color
      );
      @include track;
      background: $track-color;
      border: $track-border-width solid $track-border-color;
      border-radius: $track-radius;
      height: $track-height / 2;
    }

    &::-moz-range-thumb {
      @include thumb;
    }

    &::-ms-track {
      @include track;
      background: transparent;
      border-color: transparent;
      border-width: ($thumb-height / 2) 0;
      color: transparent;
    }

    &::-ms-fill-lower {
      @include shadow(
        $track-shadow-size,
        $track-shadow-blur,
        $track-shadow-color
      );
      background: $ie-bottom-track-color;
      border: $track-border-width solid $track-border-color;
      border-radius: ($track-radius * 2);
    }

    &::-ms-fill-upper {
      @include shadow(
        $track-shadow-size,
        $track-shadow-blur,
        $track-shadow-color
      );
      background: $track-color;
      border: $track-border-width solid $track-border-color;
      border-radius: ($track-radius * 2);
    }

    &::-ms-thumb {
      @include thumb;
      margin-top: $track-height / 4;
    }

    &:disabled {
      &::-webkit-slider-thumb,
      &::-moz-range-thumb,
      &::-ms-thumb,
      &::-webkit-slider-runnable-track,
      &::-ms-fill-lower,
      &::-ms-fill-upper {
        cursor: not-allowed;
      }
    }
  }

  .read-only {
    user-select: none;
    pointer-events: none;
  }

  .small {
    // font-size: 12px;
  }
</style>

<div class="settings" use:links>
  <div class="header">Reality Settings</div>

  <!-- <div class="parameter">
    <div class="label">Salt</div>
    <input min="0" max="10" step="0.01" type="range" bind:value={salt} />
    <div class="preview">{salt}</div>
  </div>
  <div class="parameter">
    <div class="label">Heat</div>
    <input min="0" max="100" type="range" bind:value={heat} />
    <div class="preview">{heat}</div>
  </div>
  <div class="parameter">
    <div class="label">Repulsion</div>
    <input min="0" max="100" type="range" bind:value={size} />
    <div class="preview">{size}</div>
  </div>
  <div class="parameter">
    <div class="label">Friction</div>
    <input min="0" max="100" type="range" bind:value={friction} />
    <div class="preview">{friction}</div>
  </div> -->

  <!-- <div class="parameter top">
    <div class="label">Affinity</div>
    <input min="0" max="100" type="range" bind:value={parameterA} />
    <div class="preview">{padToTwo(parameterA)}</div>
  </div>

  <div class="parameter right">
    <div class="label">Gravity</div>
    <input min="0" max="100" type="range" bind:value={parameterB} />
    <div class="preview">{padToTwo(parameterB)}</div>
  </div>

  <div class="parameter left">
    <div class="label">Heat</div>
    <input min="0" max="100" type="range" bind:value={parameterC} />
    <div class="preview">{padToTwo(parameterC)}</div>
  </div> -->

  <div class="sigil">
    {#each seedArray as cell}
      <div class="cell" class:alive={cell == '1'} />
    {/each}
  </div>

  <div class="parameter bottom">
    <div class="label small">Seed</div>
    <input min="0" max="65535" type="range" bind:value={seed} />
    <div class="preview">{padToTwo(seed)}</div>
    <!-- <div class="preview"></div> -->
  </div>

  <div class="parameter">
    <div
      class="run"
      on:click={() => {
        navigate('/' + (seed >>> 0).toString(2));
      }}>
      Start
    </div>
  </div>

</div>
