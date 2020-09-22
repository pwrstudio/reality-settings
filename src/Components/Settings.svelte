<script>
  // # # # # # # # # # # # # #
  //
  //  REALITY SETTINGS: SETTINGS
  //
  // # # # # # # # # # # # # #

  // IMPORTS
  import { links, navigate } from "svelte-routing"
  import random from "lodash/random"
  import has from "lodash/has"

  let seed = random(0, 65535)
  let seedArray = []
  let seedToBits = (seed >>> 0).toString(2)

  while (seedToBits.length < 16) {
    seedToBits = seedToBits + "0"
  }
  seedArray = seedToBits.split("")
</script>

<style lang="scss">
  @import "../variables.scss";

  $CELL_DIMENSION: 140px;
  $CELL_DIMENSION_PHONE: 80px;

  .settings {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
  }

  .settings-inner {
    // background: red;

    .header {
      font-family: "five", "Akkurat-Mono", monospace;
      font-size: 42px;
      margin-bottom: 30px;
      text-align: center;
      -webkit-text-stroke-width: 2px;
      -webkit-text-stroke-color: $black;
      letter-spacing: -2px;

      @include screen-size("small") {
        letter-spacing: -1px;
        font-size: 48px;
        margin-bottom: 40px;
        -webkit-text-stroke-width: 3px;
        -webkit-text-stroke-color: $black;
      }
    }

    .parameter {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;

      .preview {
        display: inline-block;
        @include screen-size("small") {
          display: none;
        }
      }
    }

    .run {
      height: $CELL_DIMENSION * 0.75;
      line-height: $CELL_DIMENSION * 0.75;
      width: 4 * $CELL_DIMENSION;
      cursor: pointer;
      outline: 0;
      border: 0;
      background: orangered;
      text-decoration: none;
      color: $black;
      display: block;
      text-align: center;
      transition: background 0.5s $transtion2;
      border-radius: 5px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      justify-content: center;
      align-items: center;

      .inner {
        //   width: 4 * $CELL_DIMENSION - 10px;
        //   height: $CELL_DIMENSION * 0.55;
        //   border-radius: 30px;
        // background: orangered;
      }

      transition: border-radius 0.5s ease-out;

      &:hover {
        border-radius: 20px;
      }

      @include screen-size("small") {
        height: $CELL_DIMENSION_PHONE;
        width: $CELL_DIMENSION_PHONE * 4;
        line-height: $CELL_DIMENSION_PHONE;
      }
    }
  }

  .sigil {
    width: 4 * $CELL_DIMENSION;
    height: 4 * $CELL_DIMENSION;

    background: $black;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: $CELL_DIMENSION_PHONE * 0.25;
    @include screen-size("small") {
      width: 4 * $CELL_DIMENSION_PHONE;
      height: 4 * $CELL_DIMENSION_PHONE;
    }
  }

  .cell {
    height: $CELL_DIMENSION;
    width: $CELL_DIMENSION;
    border-radius: $CELL_DIMENSION;
    line-height: $CELL_DIMENSION;
    cursor: pointer;
    color: $black;
    // font-size: 16px;
    font-size: 22px;
    -webkit-tap-highlight-color: rgba(211, 211, 211, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;

    @include screen-size("small") {
      height: $CELL_DIMENSION_PHONE;
      width: $CELL_DIMENSION_PHONE;
      border-radius: $CELL_DIMENSION_PHONE;
      line-height: $CELL_DIMENSION_PHONE;
      font-size: 32px;
    }

    // display: inline-block;
    float: left;
    background: #c4c4c4;
    background: grey;
    background: orangered;

    text-align: center;
    color: #333333;

    .text {
      display: none;
    }

    .plus {
      background: $black;
      width: $CELL_DIMENSION / 2;
      height: 1px;
    }

    .minus {
      background: $black;
      height: $CELL_DIMENSION / 2;
      width: 1px;
    }

    .plus,
    .minus {
      display: none;
      color: $black;
      opacity: 1;
      user-select: none;
    }

    transition: border-radius 0.3s ease-out;

    &:hover {
      .plus {
        display: block;
        @include screen-size("small") {
          display: none;
        }
      }
    }

    &.alive {
      border-radius: 30px;
      background: orangered;
      transition: border-radius 0.3s ease-out;

      &:hover {
        .minus {
          display: block;
          @include screen-size("small") {
            display: none;
          }
        }
        .plus {
          display: none;
        }
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
  <div class="settings-inner">
    <!-- <div class="header">Reality Settings</div> -->

    <!-- <div class="parameter bottom">
      <div class="preview">Seed: {seedArray.join('')}</div>
    </div> -->

    <div class="sigil">
      {#each seedArray as cell, index}
        <div
          class="cell"
          class:alive={cell == '1'}
          on:click={(e) => {
            seedArray[index] = seedArray[index] == '1' ? '0' : '1'
            console.dir(seedArray)
          }}>
          <!-- <div class="plus" />
          <div class="minus" /> -->
        </div>
      {/each}
    </div>

    <!-- <div class="parameter">
      <div
        class="run"
        on:click={() => {
          navigate('/seed/' + seedArray.join(''))
        }}>
        <div class="inner">Seed: {seedArray.join('')}</div>
      </div>
    </div> -->
  </div>
</div>
