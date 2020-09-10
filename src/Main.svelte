<script>
  import { onMount } from 'svelte'
  import { links, navigate } from 'svelte-routing'
  import { fade } from 'svelte/transition'
  import { Life } from 'dat-life'
  import has from 'lodash/has'
  import shuffle from 'lodash/shuffle'
  import sample from 'lodash/sample'
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
  import { globalSeed, generation, inSession } from './stores.js'

  // PROPS
  export let seed = false
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
  const MILLISECONDS_PER_GENERATION = 50

  // VARIABLES
  let blocks = []
  let testBlocks = []
  let currentBlocks = []
  let keywords = []
  let allTextOnly = ''
  let markovMaterial = []
  let landingContainerEl = {}
  let worldEl = {}
  let paneEl = {}
  let cells = []
  let zoomed = false
  let allSentences = []
  let worldLoop = {}
  let worldOut = []
  let running = false
  let stopFlag = false
  let index = false
  let countDownMarker  = false
  let initWorld =  []
  let logBlocks = []

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

  // const transitionWorld = (index) => {
  //   if (index < WORLD_SIZE) {
  //     let temp = []
  //     for (let x = 0; x < WORLD_WIDTH; x++) {
  //       temp.push(life.board[index + x])
  //     }
  //     worldOut = [...worldOut, ...temp]
  //     window.requestAnimationFrame(() => {
  //       transitionWorld(index + WORLD_WIDTH)
  //     })
  //   } else {
  //     inSession.set(true)
  //     startWorld()
  //   }
  // }

  if(section == 'project') {
    index = true;
  }

const advanceWorld = gen => {
  // console.log(gen)
  generation.set(gen)
  life.next()
  // worldOut = life.board
  worldOut = life.board
  if(!stopFlag) {
    setTimeout(() => {
      advanceWorld(gen + 1)
    }, MILLISECONDS_PER_GENERATION)
  } 
}

const startWorld = () => {
  if(!running) {
    console.log('start world')
    running = true
    stopFlag = false
    advanceWorld($generation)
  }
}

const stopWorld = () => {
  if(running) {
    console.log('stop world')
    stopFlag = true
    running = false
  }
}

  const resetWorld = () => {
    stopWorld()
    generation.set(0)
    life.randomizeFromSeed($globalSeed. Object.keys(postsMap))
    worldOut = life.board
  }

  // if (!$inSession) {
  //   transitionWorld(0)
  // } else {
  //   startWorld()
  // }

  $: {
    if (section == 'project' && slug && postsArray) {
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

  $: {
  if (logBlocks && !section && !meta && !index) {
    setTimeout(() => {
      landingContainerEl.scrollTo({
        top: landingContainerEl.scrollHeight,
        left: 0,
        behavior: "smooth"
      });
    }, 100);
  }
  }

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


    if(!section && !meta) {
      // countDown(15)
      life.randomizeFromSeed($globalSeed, Object.keys(postsMap))
      initWorld = life.board
      startWorld()
    }

    // console.dir(keywords)
    keywords = keywords

    console.dir(allSentences);

    console.log("textonly");
    console.log(allTextOnly);

    markovMaterial = allTextOnly
      .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
      .split("|");

    console.dir(markovMaterial);

    // Build the Markov generator
    const markov = new Markov(markovMaterial, { stateSize: 2 });
    markov.buildCorpus();

    const options = {
      maxTries: 200,
      filter: result => {
        // result.string.split(" ").length >= 5 &&
        return result.score > 10; // At least 5 words // End sentences with a dot.
      }
    };

    let result = [];
    for (let i = 0; i < 50; i++) {
      let newMarkov = { ...markov.generate(options), uid: uuidv4() };
      result.push(newMarkov);
    }

    console.dir(result);

    logBlocks= [...logBlocks, result.pop(), ];

    setInterval(() => {
      logBlocks= [...logBlocks, result.pop(), ];
    }, 2000);

    // console.dir(testBlocks);

    // console.dir(keywords)
    return posts
  })

  const padGen = (number) =>
    number <= 999999 ? `00000${number}`.slice(-6) : number

  const countDown = i => {
    console.log(i % 2)
    if(i === 0) {
      countDownMarker = false
      startWorld()
    } else {
      countDownMarker = $globalSeed[i]
      setTimeout(() => {
        countDown(--i)
      }, 60)
    }
  }

  onMount(async () => {

    const resizeWorld = () => {
      if(worldEl && worldEl.style && paneEl) {
        // console.log('worldEl.clientHeight', worldEl.clientHeight)
        // console.log('worldEl.clientWidth', worldEl.clientWidth)
        // console.log('paneEl.clientHeight', paneEl.clientHeight)
        // console.log('paneEl.clientWidth', paneEl.clientWidth)
        // console.log('heightRatio', paneEl.clientHeight / worldEl.clientHeight)
        // console.log('widthRatio', paneEl.clientWidth / worldEl.clientWidth)
        let heightRatio = paneEl.clientHeight / worldEl.clientHeight
        let widthRatio = paneEl.clientWidth / worldEl.clientWidth
        let smallestRatio = heightRatio > widthRatio ? widthRatio : heightRatio
        // console.log('smallestRatio', smallestRatio)
        // console.log(typeof heightRatio)
        // console.log(typeof widthRatio)
        // console.log('heightRatio > widthRatio', heightRatio > widthRatio )
        // console.log(heightRatio , '>', widthRatio, '==', heightRatio > widthRatio )
        let roundedSmallestRatio = Math.floor(smallestRatio * 10) / 10
        // console.log('roundedSmallestRatio', roundedSmallestRatio)
        worldEl.style.transform = 'scale(' + roundedSmallestRatio + ')';
      }
    }

    resizeWorld()

    window.onresize = resizeWorld


  });
</script>

<style lang="scss">
  @import './variables.scss';

  $WORLD_WIDTH: 29;
  $WORLD_HEIGHT: 29;
  $CELL_DIMENSION: 20px;
  $CELL_DIMENSION_PHONE: 3.2vw;
  $CELL_DIMENSION_SHORT: 20px;

  .landing {
    box-sizing: border-box;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    overflow-y: scroll;

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
      position: relative;
      left: 0;
      background: lightgray;
      background: grey;
      width: calc(100% - 400px);

      @include screen-size('small') {
        width: 100vw;
        height: 50vh;
      }
    }

    &.right {
      left: calc(100% - 400px);
      background: grey;
      background: lightgray;
      padding: 10px;
      padding-top: 90px;
      width: calc(400px - 20px);
      overflow-y: scroll;
      height: calc(100vh - 80px);

      @include hide-scroll;

      @include screen-size('small') {
        width: calc(100vw - 20px);
        height: 50vh;
        left: 0;
        top: 50%;
      }
    }
  }

  .index-bar {
    padding-bottom: 80px;
  }

  .log-bar {
    padding-bottom: 80px;
    font-size: 12px;
  }


  .world {
    width: $WORLD_WIDTH * $CELL_DIMENSION;
    height: $WORLD_HEIGHT * $CELL_DIMENSION;
    background: grey;
    // background: lightgray;
    // transform-origin: top left;
    position: absolute;
    top: 50%;
    margin-top: -($WORLD_WIDTH * $CELL_DIMENSION / 2);
    left: 50%;
    margin-left: -($WORLD_WIDTH * $CELL_DIMENSION / 2);
    transform: scale(1) translate3d(0, 0, 0);
    // transition: transform 0.3s ease-out;
    // will-change: transform;
    // will-change: transform;

    // @include screen-size('short') {
    //   width: $WORLD_WIDTH * $CELL_DIMENSION_SHORT;
    //   height: $WORLD_HEIGHT * $CELL_DIMENSION_SHORT;
    //   // background: green;
    // }

    @include screen-size('small') {
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
    background: rgb(57, 227, 57);
    // background: rgb(18, 197, 18);
    background: rgb(163, 15, 15);


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

  .world-control {
    height: 40px;
    line-height: 40px;
    position: fixed;
    top: 0;
    width: calc(100% - 400px);
    left: 0;
    font-size: 12px;
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
      display: none;
    }
  }


  .menu {
    height: 80px;
    position: fixed;
    top: 0px;
    width: 400px;
    overflow: hidden;
    right: 0;
    background: #a4a4a4;
    font-size: 12px;
    text-align: center;
    user-select: none;
    z-index: 100;
    border-bottom: 1px solid lightgray;
    
    .menu-item {
      line-height: 40px;
      cursor: pointer;
      display: block;

      &.half {
        width: 50%;
        float: left;
      }

      &:hover {
        text-decoration: none;
        background: grey;
      }
    }

    @include screen-size('small') {
      top: 50%;
      width: 100vw;
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
    // display: flex;
    // align-items: center;
    // flex
    cursor: pointer;
    user-select: none;

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
    // max-width: 240px;
    // font-size: 16px;
    line-height: 1em;
    // font-family: 'five', 'Akkurat-Mono', monospace;
    font-family: 'Akkurat-Mono', monospace;

  }

  .authors {
    margin-top: 0.5em;
  }

  .countdown-marker {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 1000;
    font-size: 96px;
    color: lightgray;
  }
</style>

<div class="landing" use:links>
  <div class="pane left" bind:this={paneEl}>
    <!-- WORLD -->
    {#if countDownMarker }
      <div class='countdown-marker'>{countDownMarker}</div>
    {/if}

    {#if !section && !meta}
      <div
        class="world"
        class:zoomed
        bind:this={worldEl}
        on:click={(e) => {
          if (zoomed) {
            zoomed = false
            worldEl.style.transformOrigin = 'center center'
            worldEl.style.transform = 'scale(1)';

          } else {
            zoomed = true
            worldEl.style.transformOrigin = e.x - worldEl.offsetLeft + 'px ' + (e.y - worldEl.offsetTop) + 'px'
            worldEl.style.transform = 'scale(5)';
          }
        }}>
        {#each worldOut as cell, index}
          <div
            class="cell"
            data-index={index}
            data-x={index % 39}
            data-y={Math.floor(index / 39)}
            class:alive={cell}>
            <span class="text">{index}:{initWorld[index]}</span>
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
  <div class="pane right" use:links bind:this={landingContainerEl}>
   
    <div class="menu">
      <a href='/' class="menu-item">{$globalSeed} => {padGen($generation)}</a>
      <div class="menu-item half" on:click={() => {index = !index}}>{#if !index}Index{:else}Log{/if}</div>
      <a href='/meta' class="menu-item half">Meta</a>
    </div>

    <!-- SIDEBAR => LOG-->
    {#if !meta && !index}
      <div class='log-bar'>
        {#each logBlocks as log (log.uid)}
        <div class='post' in:fade on:click={e => {
          navigate('/project/' + sample(postsArray).slug.current)
        }}>
          <div class="title">{log.string}</div>
        </div>
      {/each}
      </div>
    {/if}

    <!-- SIDEBAR => INDEX -->
    {#if index}
      {#await posts then posts}
        <div class='index-bar'>
          {#each posts as post, index (post._id)}
            <a href={'/project/' + post.slug.current} class="post" in:fade={{delay: 40 * index}}>
              <div class="title">{post.title}</div>
              <div class="authors">
                {#if post.authors && Array.isArray(post.authors)}
                  {#each post.authors as author}
                      <div class="author">{author.name}</div>
                  {/each}
                {/if}
              </div>
            </a>
          {/each}
          {#each keywords as keyword}
            <a href={'/keyword/' + keyword} class="post" in:fade>
              <div class="title">{keyword}</div>
            </a>
          {/each}
        </div>
      {/await}
    {/if}

    <!-- SIDEBAR => META -->
    {#if meta && !index}
      {#await authors then authors}
        {#each authors as author}
          <a href={'/author/' + author.slug.current} class="post" in:fade>
            <div class="title">{author.name}</div>
          </a>
        {/each}
      {/await}
    {/if}
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

{/if}

{#if zoomed}
  <div class='nav-arrow up'>UP</div>
  <div class='nav-arrow down'>DOWN</div>
  <div class='nav-arrow left'>LEFT</div>
  <div class='nav-arrow right'>RIGHT</div>
{/if}
