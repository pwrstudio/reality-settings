<script>
  import { links, navigate } from 'svelte-routing'
  import random from 'lodash/random'
  import has from 'lodash/has'

  import {
    urlFor,
    loadData,
    renderBlockText,
    toPlainText,
    singleToPlainText,
  } from '../sanity.js'

  let seed = random(0, 65535)
  let seedArray = []

  let seedToBits = (seed >>> 0).toString(2)

  while (seedToBits.length < 16) {
    seedToBits = seedToBits + '0'
  }

  seedArray = seedToBits.split('')
  // console.log(seedArray)
  // console.log(Array.isArray(seedArray))


  const padToTwo = (number) =>
    number <= 9999 ? `00000${number}`.slice(-5) : number
</script>

<style lang="scss">
  @import '../variables.scss';

  $CELL_DIMENSION: 120px;
  $CELL_DIMENSION_PHONE: 60px;


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
      font-family: 'five', 'Akkurat-Mono', monospace;
      font-size: 42px;
      margin-bottom: 30px;
      text-align: center;
      -webkit-text-stroke-width: 2px;
      -webkit-text-stroke-color: #222222;
      letter-spacing: -2px;

      @include screen-size('small') {
        letter-spacing: -1px;
        font-size: 48px;
        margin-bottom: 40px;
        -webkit-text-stroke-width: 3px;
        -webkit-text-stroke-color: #222222;
      }
    }

    .parameter {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;

      .preview {
        display: inline-block;
        @include screen-size('small') {
          display: none;
        }
      }
    }

    .run {
      height: $CELL_DIMENSION * 0.75;
      line-height: $CELL_DIMENSION * 0.75;
      width: 4 *  $CELL_DIMENSION;
      cursor: pointer;
      outline: 0;
      border: 0;
      background: lightgray;
      text-decoration: none;
      color: #222222;
      display: block;
      text-align: center;
      transition: background 0.5s $transtion2;
      border-radius: 5px;
      margin-left: auto;
      margin-right: auto;

      &:hover {
        background: white;
      }

      @include screen-size('small') {
      height:  $CELL_DIMENSION_PHONE;
    width:  $CELL_DIMENSION_PHONE * 4;
    line-height:  $CELL_DIMENSION_PHONE;

    }

    }
  }

  .sigil {
    width: 4 *  $CELL_DIMENSION;
    height:4 *  $CELL_DIMENSION;

    background: grey;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: $CELL_DIMENSION_PHONE * 0.25;
    @include screen-size('small') {
      width: 4 *  $CELL_DIMENSION_PHONE;
    height:4 *  $CELL_DIMENSION_PHONE;

    }
  }

  .cell {
    height:  $CELL_DIMENSION;
    width:  $CELL_DIMENSION;
    border-radius:  $CELL_DIMENSION;
    line-height:  $CELL_DIMENSION;
    cursor: pointer;
    color: black;
    // font-size: 16px;
    font-size: 52px;
    -webkit-tap-highlight-color: lightgray;

    @include screen-size('small') {
      height:  $CELL_DIMENSION_PHONE;
    width:  $CELL_DIMENSION_PHONE;
    border-radius:  $CELL_DIMENSION_PHONE;
    line-height:  $CELL_DIMENSION_PHONE;
    font-size: 32px;

    }

    // display: inline-block;
    float: left;
    background: #c4c4c4;
    background: grey;
    background: rgb(57, 227, 57);
    text-align: center;
    color: #333333;

    .text {
      display: none;
    }

    .plus, .minus  {
      display: none;
      color: white;
        opacity: 0.5;
        user-select: none;
    }

    transition: background 0.3s ease-out;

    &:hover {
      .plus {
        display: block;
        @include screen-size('small') {
          display: none;
        }
      }
    }

    &.alive {
      border-radius: 25px;
      background: orangered;
      transition: background 0.3s ease-out;


      &:hover {
        .minus {
          display: block;
          @include screen-size('small') {
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
        <div class="cell" class:alive={cell == '1'} on:click={e =>{
            seedArray[index] = seedArray[index] == '1' ? '0' : '1';
            console.dir(seedArray)
          }}>
          <div class='plus'>+</div>
          <div class='minus'>-</div>
          </div>
      {/each}
    </div>

    <div class="parameter">
      <div
        class="run"
        on:click={() => {
          navigate('/seed/' + seedArray.join(''))
        }}>
        Seed: {seedArray.join('')}
      </div>
    </div>
  </div>
</div>
