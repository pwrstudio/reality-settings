<script>
  import { onMount } from 'svelte'
  import { links } from 'svelte-routing'
  import { fade } from 'svelte/transition'
  import { Life } from 'dat-life'
  import has from 'lodash/has'
  import shuffle from 'lodash/shuffle'
  import flatMap from 'lodash/flatMap'
  import Markov from 'markov-strings'
  import random from 'lodash/random'
  import { v4 as uuidv4 } from 'uuid'

  import {
    urlFor,
    loadData,
    renderBlockText,
    toPlainText,
    singleToPlainText,
  } from './sanity.js'

  // STORES
  import { globalSeed, globalHeat, generation, inSession } from './stores.js'

  // PROPS
  export let seed = false
  export let heat = false
  export let start = false
  export let meta = false
  export let slug = false
  export let section = false

  // COMPONENTS
  import Molecule from './Components/Molecule.svelte'
  import Ball from './Components/Ball.svelte'
  import ProjectView from './ProjectView.svelte'
  import AuthorView from './AuthorView.svelte'
  import MetaView from './MetaView.svelte'

  // CONSTANTS
  const query = '*[_type == "project"]{...,authors[]->{...}}'
  const authorQuery = '*[_type == "author"]'
  const metaQuery = '*[_id == "introduction"]{...,authors[]->{...}}[0]'
  const WORLD_WIDTH = 29
  const WORLD_HEIGTH = 29
  const WORLD_SIZE = WORLD_WIDTH * WORLD_HEIGTH
  const genDuration = 50

  // VARIABLES
  let blocks = []
  let testBlocks = []
  let currentBlocks = []
  let keywords = []
  let allTextOnly = ''
  let markovMaterial = []
  let landingContainerEl = {}
  let worldEl = {}
  let cells = []
  let zoomed = false
  let allSentences = []
  let worldLoop = {}
  let worldOut = []
  let running = true

  // => Posts
  let posts = loadData(query)
  let postsMap = {}
  let postsArray = []
  let projectPost = false

  // => Authors
  let authors = loadData(authorQuery)
  let authorsArray = []
  let authorPost = false

  // => Meta
  let metaData = loadData(metaQuery)
  let metaPost = false

  const life = new Life(WORLD_WIDTH, WORLD_HEIGTH)
  // life.colors = 4;

  life.randomize()

  const transitionWorld = (index) => {
    if (index < WORLD_SIZE) {
      let temp = []
      for (let x = 0; x < WORLD_WIDTH; x++) {
        temp.push(life.board[index + x])
      }
      worldOut = [...worldOut, ...temp]
      window.requestAnimationFrame(() => {
        transitionWorld(index + WORLD_WIDTH)
      })
    } else {
      inSession.set(true)
      startWorld()
    }
  }

  const startWorld = () => {
    running = true
    generation.set($generation + 1)
    life.next()
    worldOut = life.board
    worldLoop = setInterval(() => {
      generation.set($generation + 1)
      life.next()
      worldOut = life.board
    }, genDuration)
  }

  const stopWorld = () => {
    running = false
    clearInterval(worldLoop)
  }

  const resetWorld = () => {
    stopWorld()
    generation.set(0)
    life.randomize()
    worldOut = life.board
    // startWorld();
  }

  if (!$inSession) {
    transitionWorld(0)
  } else {
    startWorld()
  }

  $: {
    if (section == 'project' && slug && postsArray) {
      // console.log(slug)
      stopWorld()
      projectPost = false
      setTimeout(() => {
        projectPost = postsArray.find((p) => p.slug.current == slug)
      }, 100)
    }
    if (section == 'author' && slug && authorsArray) {
      stopWorld()
      console.log(slug)
      authorPost = false
      setTimeout(() => {
        authorPost = authorsArray.find((p) => p.slug.current == slug)
      }, 100)
    }
    if (meta && metaPost) {
      stopWorld()
    }
  }

  // $: {
  // if (currentBlocks) {
  //   setTimeout(() => {
  //     landingContainerEl.scrollTo({
  //       top: landingContainerEl.scrollHeight,
  //       left: 0,
  //       behavior: "smooth"
  //     });
  //   }, 100);
  // }
  // }

  // Set random seed if undefined
  globalSeed.set(seed ? seed : (random(0, 65535) >>> 0).toString(2))

  metaData.then((metaData) => {
    metaPost = metaData
  })

  authors.then((authors) => {
    authorsArray = authors
  })

  posts.then((posts) => {
    postsArray = posts

    posts.forEach((post) => {
      // Add to map
      postsMap[post._id] = post

      if (toPlainText(post.mainContent.content).length > 10) {
        allTextOnly =
          allTextOnly +
          toPlainText(post.mainContent.content)
            .replace(/\r?\n|\r/g, ' ')
            .trim()
      }

      // console.log(toPlainText(post.mainContent.content));
      // console.log(post.title);
      // console.log(allTextOnly);

      let sentences = allTextOnly.match(/[^\.!\?]+[\.!\?]+/g)

      if (sentences) {
        sentences = sentences.map((s) => {
          return { text: s.trim(), title: post.title, slug: post.slug.current }
        })
        // console.dir(sentences);

        allSentences = [...allSentences, ...sentences]
      }

      // Get all blocks
      post.mainContent.content.forEach((block) => {
        // console.log(singleToPlainText(block).length)
        if (block._type !== 'block' || singleToPlainText(block).length > 0) {
          blocks.push({
            id: post._id,
            uid: uuidv4(),
            content: block,
          })
        }
        // if (block._type == "block") {
        //   console.dir(block);
        // }
      })

      // KEYWORDS
      let children = flatMap(
        post.mainContent.content
          .filter((c) => c._type == 'block')
          .map((b) => b.children)
      )

      // console.dir(children)

      children.forEach((c) => {
        if (c.marks.length > 0 && c.marks.includes('keyword')) {
          // console.dir(c)
          keywords.push(c.text)
        }
      })

      // let b = a.map(x => x);

      // console.dir(b);

      // keywords = [...keywords, ...a.filter(x => x._type === "keyword")];
    })

    // console.dir(keywords)
    keywords = keywords

    // console.dir(allSentences);

    // console.log("textonly");
    // console.log(allTextOnly);

    // markovMaterial = allTextOnly
    //   .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
    //   .split("|");

    // console.dir(markovMaterial);

    // Build the Markov generator
    // const markov = new Markov(markovMaterial, { stateSize: 2 });
    // markov.buildCorpus();

    // const options = {
    //   maxTries: 500,
    //   filter: result => {
    //     // result.string.split(" ").length >= 5 &&
    //     return result.score > 10; // At least 5 words // End sentences with a dot.
    //   }
    // };

    // let result = [];
    // for (let i = 0; i < 50; i++) {
    //   let newMarkov = { ...markov.generate(options), uid: uuidv4() };
    //   result.push(newMarkov);
    // }

    // console.dir(result);

    testBlocks = shuffle(blocks)
    // allSentences = shuffle(allSentences);

    // currentBlocks.push(testBlocks.pop());
    currentBlocks = testBlocks

    // setInterval(() => {
    //   currentBlocks.push(testBlocks.pop());
    //   currentBlocks = currentBlocks;
    // }, 5000);

    // console.dir(testBlocks);

    // console.dir(keywords)
    return posts
  })

  const padGen = (number) =>
    number <= 999999 ? `00000${number}`.slice(-6) : number

  // onMount(async () => {
  //   setTimeout(() => {
  //     setInterval(() => {
  //       // conGen++;
  //       // console.log(conGen);
  //       generation.set($generation + 1);
  //       life.next();
  //       worldOut = life.board;
  //     }, 200);
  //   }, 5000);
  // });
</script>

<style lang="scss">
  @import './variables.scss';

  $WORLD_WIDTH: 29;
  $WORLD_HEIGHT: 29;
  $CELL_DIMENSION: 2vw;
  $CELL_DIMENSION_PHONE: 3.2vw;
  $CELL_DIMENSION_SHORT: 1.5vw;

  .landing {
    box-sizing: border-box;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    padding-right: 10%;
    padding-left: 10%;
    overflow-y: scroll;
    padding-bottom: 25vh;

    @include hide-scroll;
  }

  h1 {
    padding: 20px;
  }

  img {
    max-width: 100%;
  }

  .markov {
    width: 1400px;
    max-width: 95%;
    overflow: hidden;
    padding: 10px;
  }

  .markov .info {
    font-size: 12px;
    padding: 5px;
    color: #222222;
    background: rgb(255, 255, 161);
    display: inline-block;
  }

  .pane {
    height: 100vh;
    position: fixed;
    top: 0;

    &.left {
      // width: 66.66%;

      left: 0;
      background: lightgray;
      background: grey;
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100% - 400px);

      @include screen-size('small') {
        width: 100%;
        height: 50%;
      }

      &.mini {
        // transform: translateY(-600px);
        display: none;
      }
    }

    &.right {
      // width: 33.33%;
      left: calc(100% - 400px);
      // left: 66.66%;
      background: grey;
      background: lightgray;
      padding: 20px;
      padding-top: 60px;
      width: calc(400px - 40px);
      overflow-y: scroll;
      height: calc(100vh - 80px);

      @include screen-size('small') {
        width: calc(100% - 40px);
        height: 50%;
        left:0;
        top: 50%;
      }
    }
  }

  .world {
    width: $WORLD_WIDTH * $CELL_DIMENSION;
    height: $WORLD_HEIGHT * $CELL_DIMENSION;
    background: grey;
    // transform-origin: top left;
    // transform: scale(1.45);
    // transition: transform 0.5s ease-out;
    // will-change: transform;
    // will-change: transform;

    @media (min-aspect-ratio: 16/9) {
      width: $WORLD_WIDTH * $CELL_DIMENSION_SHORT;
      height: $WORLD_HEIGHT * $CELL_DIMENSION_SHORT;
      // background: green;
    }

    @include screen-size('small') {
      width: $WORLD_WIDTH * $CELL_DIMENSION_PHONE;
      height: $WORLD_HEIGHT * $CELL_DIMENSION_PHONE;
    }

    &.zoomed {
      transform: scale(5);
    }
  }

  .cell {
    height: $CELL_DIMENSION;
    width: $CELL_DIMENSION;
    border-radius: $CELL_DIMENSION;
    line-height: $CELL_DIMENSION;
    user-select: none;
    float: left;
    background: #a4a4a4;
    font-size: 2px;
    text-align: center;
    color: #333333;
    transition: none;

    // &:hover {
    //   background: #b4b4b4;
    // }

    @media (min-aspect-ratio: 16/9) {
      height: $CELL_DIMENSION_SHORT;
      width: $CELL_DIMENSION_SHORT;
      border-radius: $CELL_DIMENSION_SHORT;
      line-height: $CELL_DIMENSION_SHORT;
    }

    @include screen-size('small') {
      height: $CELL_DIMENSION_PHONE;
      width: $CELL_DIMENSION_PHONE;
      border-radius: $CELL_DIMENSION_PHONE;
      line-height: $CELL_DIMENSION_PHONE;
    }

    .text {
      display: none;
    }

    &.alive {
      border-radius: 5px;
      background: orangered;
      // &:hover {
      //   background: #d70000;
      // }
    }

    &.colorTwo {
      border-radius: 5px;
      background: #00ff00;
      // &:hover {
      //   background: #d70000;
      // }
    }

    &.colorThree {
      border-radius: 5px;
      background: #ffff00;
      // &:hover {
      //   background: #d70000;
      // }
    }
  }

  .zoomed {
    .cell {
      .text {
        display: block;
      }
    }
  }

  .bottom-bar {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: calc(100% - 400px);
    left: 0;
    // background: #a4a4a4;
    font-size: 12px;
    // padding-left: 20px;
    text-align: center;

    @include screen-size('small') {
      width: 100%;
    }
  }

  .world-control {
    height: 40px;
    line-height: 40px;
    position: fixed;
    top: 0;
    width: calc(100% - 400px);
    left: 0;
    font-size: 12px;
    // padding-left: 20px;
    text-align: center;
    display: flex;
    justify-content: center;
    user-select: none;

    .control {
      cursor: pointer;
      &.first {
        margin-right: 20px;
      }
      &:hover {
        text-decoration: underline;
      }
    }

    @include screen-size('small') {
      width: 100%;
    }
  }

  .top-bar {
    height: 40px;
    line-height: 40px;
    position: fixed;
    top: 0;
    width: 400px;
    overflow: hidden;
    right: 0;
    background: #a4a4a4;
    font-size: 12px;
    // padding-left: 20px;
    text-align: center;

    @include screen-size('small') {
      display: none;
    }
  }

  .post {
    margin: 5px;
    margin-bottom: 10px;
    padding: 20px;
    background: #a4a4a4;
    border-radius: 20px;
    display: block;
    font-size: 12px;
    // max-width: 300px;
    display: flex;
    align-items: center;

    &:hover {
      transition: background 0.3 ease-out;
      text-decoration: none;
      background: #949494;
    }
  }

  .icon {
    height: 10px;
    width: 10px;
    // border-radius: 20px;
    background: orangered;
    margin-right: 10px;
  }

  .avatar {
    height: 10px;
    width: 10px;
    // border-radius: 20px;
    background: #00ff00;
    margin-right: 10px;
  }

  .key {
    height: 10px;
    width: 10px;
    // border-radius: 20px;
    background: #ffff00;
    margin-right: 10px;
  }

  .title {
    max-width: 240px;
  }
</style>

<div class="landing" use:links bind:this={landingContainerEl}>
  <div class="pane left">
    <!-- WORLD -->
    {#if !section && !meta}
      <div
        class="world"
        class:zoomed
        bind:this={worldEl}
        on:click={(e) => {
          if (zoomed) {
            zoomed = false
            worldEl.style.transformOrigin = 'center center'
          } else {
            zoomed = true
            // console.dir(worldEl.offsetTop)
            // console.dir(worldEl.offsetLeft)
            worldEl.style.transformOrigin = e.x - worldEl.offsetLeft + 'px ' + (e.y - worldEl.offsetTop) + 'px'
          }
        }}>
        {#each worldOut as cell, index}
          <div
            class="cell"
            data-index={index}
            data-x={index % 39}
            data-y={Math.floor(index / 39)}
            class:alive={cell == 1}
            class:colorTwo={cell == 2}
            class:colorThree={cell == 3}>
            <span class="text">{index}</span>
          </div>
        {/each}
      </div>
    {/if}


  </div>

  <!-- PROJECT -->
  {#if section == 'project' && projectPost}
    <ProjectView {projectPost} />
  {/if}

  <!-- AUTHOR -->
  {#if section == 'author' && authorPost}
    <AuthorView {authorPost} />
  {/if}

  <!-- META -->
  {#if meta && metaPost}
    <MetaView {metaPost} />
  {/if}


  <!-- INFO PANE -->
  <div class="pane right" use:links>
    <div class="top-bar">Reality Settings / Seed => {$globalSeed}</div>

    {#await posts then posts}
      {#each posts as post}
        <a href={'/project/' + post.slug.current} class="post" in:fade>
          <div class="icon" />
          <div class="title">{post.title}</div>
        </a>
      {/each}
    {/await}

    {#each keywords as keyword}
      <a href={'/keyword/' + keyword} class="post" in:fade>
        <div class="key" />
        <div class="title">{keyword}</div>
      </a>
    {/each}

    {#await authors then authors}
      {#each authors as author}
        <a href={'/author/' + author.slug.current} class="post" in:fade>
          <div class="avatar" />
          <div class="title">{author.name}</div>
        </a>
      {/each}
    {/await}
  </div>
</div>

{#if !section && !meta}
  <div class="world-control">
    {#if running}
      <div
        class="control first"
        on:click={() => {
          stopWorld()
        }}>
        Pause
      </div>
    {:else}
      <div
        class="control first"
        on:click={() => {
          startWorld()
        }}>
        Start
      </div>
    {/if}
    <div
      class="control first"
      on:click={() => {
        resetWorld()
      }}>
      Reset
    </div>
    {#if zoomed}
      <div
        class="control"
        on:click={() => {
          zoomed = false
        }}>
        Zoom Out
      </div>
    {:else}
      <div
        class="control"
        on:click={() => {
          zoomed = true
        }}>
        Zoom In
      </div>
    {/if}
  </div>

  <div class="bottom-bar">Gen => {padGen($generation)}</div>
{/if}
