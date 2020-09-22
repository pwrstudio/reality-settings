<script>
  // # # # # # # # # # # # # #
  //
  //  WORLD
  //
  // # # # # # # # # # # # # #

  // *** PROPS
  export let worldOut = []

  //   *** VARIABLES
  let zoomed = false

  // *** DOM REFERENCES
  let worldEl = {}
</script>

<style lang="scss">
  @import "./variables.scss";

  $WORLD_WIDTH: 27;
  $WORLD_HEIGHT: 41;
  $CELL_DIMENSION: 20px;
  $CELL_DIMENSION_PHONE: 3.2vw;
  $CELL_DIMENSION_SHORT: 20px;

  .world {
    width: $WORLD_WIDTH * $CELL_DIMENSION;
    height: $WORLD_HEIGHT * $CELL_DIMENSION;
    background: grey;
    background: #222222;
    // background: orangered;
    // transform-origin: top left;
    position: absolute;
    top: 50%;
    margin-top: -($WORLD_HEIGHT * $CELL_DIMENSION / 2);
    left: 50%;
    margin-left: -($WORLD_WIDTH * $CELL_DIMENSION / 2);
    transform: scale(1) translate3d(0, 0, 0);
    // transition: transform 0.3s ease-out;
    // will-change: transform;
    // will-change: transform;

    // @include screen-size('short') {
    //   width: $WORLD.WIDTH * $CELL_DIMENSION_SHORT;
    //   height: $WORLD_HEIGHT * $CELL_DIMENSION_SHORT;
    //   // background: green;
    // }

    @include screen-size("small") {
      pointer-events: none;
    }

    &.zoomed {
      transform: scale(9) translate3d(0, 0, 0);
    }
  }

  .cell {
    height: $CELL_DIMENSION;
    width: $CELL_DIMENSION;
    border-radius: $CELL_DIMENSION;
    line-height: $CELL_DIMENSION - 10px;
    user-select: none;
    float: left;
    background: #a4a4a4;
    background: orangered;
    // border: 1px solid #222222;

    // background: rgb(18, 197, 18);
    // background: rgb(163, 15, 15);
    // background: rgb(255, 119, 70);
    // background: darkgrey;
    // background: #6d6d6d;

    font-size: 2px;
    text-align: center;
    color: #333333;
    transition: none;

    // &:hover {
    //   background: #b4b4b4;
    // }

    // @media (min-aspect-ratio: 16/9) {
    //   height: $CELL_DIMENSION_SHORT;
    //   width: $CELL_DIMENSION_SHORT;
    //   border-radius: $CELL_DIMENSION_SHORT;
    //   line-height: $CELL_DIMENSION_SHORT;
    // }

    // @include screen-size('small') {
    //   height: $CELL_DIMENSION_PHONE;
    //   width: $CELL_DIMENSION_PHONE;
    //   border-radius: $CELL_DIMENSION_PHONE;
    //   line-height: $CELL_DIMENSION_PHONE;
    // }

    .text {
      display: none;
      line-height: $CELL_DIMENSION + 2px;
      color: #333333;
    }

    transition: background 0.5s ease-out, border-radius 1s ease-out;

    &.alive {
      border-radius: 0px;
      // background: #7e7e7e;
      background: orangered;

      // &:hover {
      // background: #d70000;
      // }
    }

    &.path {
      border-radius: 4px;
      background: rgb(174, 255, 174);
      // background: rgb(100, 100, 100);
      // background: rgb(163, 15, 15);

      // &:hover {
      //   background: #d70000;
      // }
    }

    &.destination {
      border-radius: $CELL_DIMENSION;
      background: #ffff00;
      background: rgb(10, 10, 10);
      background: rgb(152, 182, 152);
      // background: rgb(255, 0, 0);

      // &:hover {
      //   background: #d70000;
      // }
    }
  }

  .zoomed {
    .cell {
      .text {
        // display: block;
      }
    }
  }
</style>

<div
  class="world"
  id="world"
  class:zoomed
  bind:this={worldEl}
  on:click={(e) => {
    if (zoomed) {
      zoomed = false
      worldEl.style.transformOrigin = 'center center'
      worldEl.style.transform = 'scale(1)'
    } else {
      zoomed = true
      worldEl.style.transformOrigin = e.x - worldEl.offsetLeft + 'px ' + (e.y - worldEl.offsetTop) + 'px'
      worldEl.style.transform = 'scale(8)'
    }
  }}>
  {#each worldOut as cell, index}
    <div
      class="cell"
      data-index={index}
      class:alive={cell === 1}
      class:path={cell === 2}
      class:destination={cell === 3}>
      <span class="text">{index}</span>
    </div>
  {/each}
</div>
