<script>
  // # # # # # # # # # # # # #
  //
  //  REALITY SETTINGS: MAIN
  //
  // # # # # # # # # # # # # #

  // IMPORTS
  import { onMount } from "svelte"
  import { Router, Route, links, navigate } from "svelte-routing"
  import { Life } from "dat-life"
  import get from "lodash/get"
  import shuffle from "lodash/shuffle"
  import sample from "lodash/sample"
  import flatMap from "lodash/flatMap"
  import Markov from "markov-strings"
  import random from "lodash/random"
  import { v4 as uuidv4 } from "uuid"
  import EasyStar from "easystarjs"
  import { fade } from "svelte/transition"

  // *** SANITY
  import {
    urlFor,
    loadData,
    renderBlockText,
    toPlainText,
    singleToPlainText,
  } from "./sanity.js"

  // *** STORES
  import { globalSeed, generation, epoch } from "./stores.js"

  // *** GLOBAL
  import {
    MILLISECONDS_PER_GENERATION,
    EPOCH_LENGTH,
    WORLD,
    QUERY,
    getRandomInt,
    padGen,
    listToMatrix,
  } from "./global.js"

  // *** COMPONENTS
  import ProjectView from "./ProjectView.svelte"
  import AuthorView from "./AuthorView.svelte"
  import MetaView from "./MetaView.svelte"
  import LogList from "./LogList.svelte"
  import ProjectsList from "./ProjectsList.svelte"
  import AuthorList from "./AuthorList.svelte"
  import World from "./World.svelte"
  import Settings from "./Components/Settings.svelte"

  // *** PROPS
  export let params = false

  // *** DOM REFERENCES
  let worldEl = {}
  let paneLeftEl = false
  let paneRightEl = false

  // *** VARIABLES
  let blocks = []
  let testBlocks = []
  let currentBlocks = []
  let keywords = []
  let allTextOnly = ""
  let markovMaterial = []
  let allSentences = []
  let worldOut = []
  let running = false
  let stopFlag = false
  let logBlocks = []
  let section = false
  let slug = false
  let loaded = false

  $: {
    // Split URL parameters
    // console.log("* * * * * ")
    // console.log("PARAMS UPDATED")
    // console.log("– params", params)
    const args = get(params, "[*]", "").split("/")
    section = args[0] && args[0].length > 0 ? args[0] : "seed"
    slug = args[1] && args[1].length > 0 ? args[1] : false
    // console.log("– section", section)
    // console.log("– slug", slug)
    // console.log("* * * * * ")
  }

  $: {
    // console.log("slug change")
    // console.dir(paneLeftEl)
    if ((slug || section == "meta") && paneLeftEl) {
      // console.log("YYYYYYYY")
      paneLeftEl.scrollTo({ top: 0 })
    }
  }

  $: {
    // console.log("section change")
    if (section && paneRightEl) {
      paneRightEl.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Game of Life
  const life = new Life(WORLD.WIDTH, WORLD.HEIGHT)

  const transitionWorld = (index) => {
    resizeWorld()
    if (index < WORLD.SIZE) {
      let temp = []
      // worldOut.push(life.board[index])
      // worldOut.push(life.board[index + 1])
      // worldOut.push(life.board[index + 2])
      // worldOut.push(life.board[index + 3])
      // worldOut = worldOut
      for (let x = 0; x < WORLD.WIDTH; x++) {
        temp.push(life.board[index + x])
      }
      worldOut = [...worldOut, ...temp]
      window.requestAnimationFrame(() => {
        transitionWorld(index + WORLD.WIDTH)
      })
    } else {
      // setTimeout(() => {
      loaded = true
      startWorld()
      // }, 500)
    }
  }

  const drawPath = (path) => {
    // const startIndex = path[0].x + WORLD.WIDTH * path[0].y
    // worldOut[startIndex] = 3

    if (path.length > 0) {
      const currentPoint = path.shift()
      // console.dir(currentPoint)
      const pointIndex = currentPoint.x + WORLD.WIDTH * currentPoint.y
      // console.log(pointIndex)
      worldOut[pointIndex] = 2
      // setTimeout(() => {
      requestAnimationFrame(() => {
        drawPath(path)
      })
      // }, 50)
    } else {
      if (logBlocks.length > 0) {
        let newBlock = logBlocks.pop()
        newBlock.meta = {
          epoch: padGen($epoch),
          generation: $generation,
        }
        currentBlocks.push(newBlock)
        currentBlocks = currentBlocks
      }
      setTimeout(() => {
        startWorld()
      }, 1500)
    }
  }

  const advanceWorld = (gen) => {
    generation.set(gen)
    life.next()
    worldOut = life.board
    if (gen % EPOCH_LENGTH === EPOCH_LENGTH - 1) {
      epoch.set($epoch + 1)
      stopWorld()
      // console.dir(worldOut)
      const newGrid = listToMatrix(worldOut, WORLD.WIDTH)
      // console.dir(newGrid)
      const easystar = new EasyStar.js()
      easystar.setGrid(newGrid)
      easystar.setAcceptableTiles([0])
      const randomStart = {
        x: getRandomInt(0, WORLD.WIDTH - 1),
        y: getRandomInt(0, WORLD.HEIGHT - 1),
      }
      const randomEnd = {
        x: getRandomInt(0, WORLD.WIDTH - 1),
        y: getRandomInt(0, WORLD.HEIGHT - 1),
      }
      easystar.findPath(
        randomStart.x,
        randomStart.y,
        randomEnd.x,
        randomEnd.y,
        (path) => {
          // console.dir(path)
          if (path && Array.isArray(path) && path.length > 0) {
            // console.dir(path.length)
            const endIndex =
              path[path.length - 1].x + WORLD.WIDTH * path[path.length - 1].y
            worldOut[endIndex] = 3
            path.pop()
            drawPath(path)
          } else {
            startWorld()
          }
        }
      )

      easystar.calculate()
    } else {
      if (!stopFlag) {
        // requestAnimationFrame(() => {
        setTimeout(() => {
          advanceWorld(gen + 1)
        }, 2500)
        // })
      }
    }
  }

  const startWorld = () => {
    if (!running) {
      // console.log("start world")
      running = true
      stopFlag = false
      advanceWorld($generation + 1)
    }
  }

  const stopWorld = () => {
    if (running) {
      // console.log("stop world")
      stopFlag = true
      running = false
    }
  }

  const resetWorld = () => {
    stopWorld()
    generation.set(0)
    life.randomizeFromSeed($globalSeed)
    worldOut = life.board
  }

  const resizeWorld = () => {
    // worldEl = document.getElementById("world")
    // if (worldEl && worldEl.style && paneEl) {
    //   // const heightRatio = (paneEl.clientHeight - 60) / worldEl.clientHeight
    //   // const widthRatio = (paneEl.clientWidth - 60) / worldEl.clientWidth
    //   // const smallestRatio = heightRatio > widthRatio ? widthRatio : heightRatio
    //   // const roundedSmallestRatio = Math.floor(smallestRatio * 10) / 10
    //   console.log("worldwidh", worldEl.clientWidth)
    //   const ratio = paneEl.clientWidth / worldEl.clientWidth
    //   worldEl.style.transform = "scale(" + ratio + ")"
    // }
  }

  // Load data
  let postsMap = {}
  let metaPost = false
  let projects = []
  let authors = []
  let posts = loadData(QUERY.ALL)

  onMount(async () => {
    posts.then((posts) => {
      // console.dir(posts)
      metaPost = posts.find((p) => p._type === "introduction")
      authors = posts.filter((p) => p._type === "author")
      projects = posts.filter((p) => p._type === "project")
      projects = Array.isArray(projects) ? shuffle(projects) : []

      projects.forEach((post) => {
        // Add to map
        postsMap[post._id] = post

        if (toPlainText(post.mainContent.content).length > 10) {
          allTextOnly =
            allTextOnly +
            toPlainText(post.mainContent.content)
              .replace(/\r?\n|\r/g, " ")
              .trim()
        }

        // console.log(toPlainText(post.mainContent.content));
        // console.log(post.title);
        // console.log(allTextOnly);

        let sentences = allTextOnly.match(/[^\.!\?]+[\.!\?]+/g)

        if (sentences) {
          sentences = sentences.map((s) => {
            return {
              text: s.trim(),
              title: post.title,
              slug: post.slug.current,
            }
          })
          // console.dir(sentences);

          allSentences = [...allSentences, ...sentences]
        }

        // Get all blocks
        // post.mainContent.content.forEach((block) => {
        //   // console.log(singleToPlainText(block).length)
        //   if (block._type !== "block" || singleToPlainText(block).length > 0) {
        //     blocks.push({
        //       id: post._id,
        //       uid: uuidv4(),
        //       content: block,
        //     })
        //   }
        // if (block._type == "block") {
        //   console.dir(block);
        // }
        // })

        // KEYWORDS
        let children = flatMap(
          post.mainContent.content
            .filter((c) => c._type == "block")
            .map((b) => b.children)
        )

        // console.dir(children)

        children.forEach((c) => {
          if (c.marks.length > 0 && c.marks.includes("keyword")) {
            // console.dir(c)
            keywords.push(c.text)
          }
        })

        // let b = a.map(x => x);

        // console.dir(b);

        // keywords = [...keywords, ...a.filter(x => x._type === "keyword")];
      })

      markovMaterial = allTextOnly
        .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
        .split("|")

      // Build the Markov generator
      const markov = new Markov(markovMaterial, { stateSize: 2 })
      markov.buildCorpus()

      const options = {
        maxTries: 200,
        filter: (result) => {
          // result.string.split(" ").length >= 5 &&
          return result.score > 10 // At least 5 words // End sentences with a dot.
        },
      }

      let result = []
      for (let i = 0; i < 10; i++) {
        let newMarkov = { ...markov.generate(options), uid: uuidv4() }
        result.push(newMarkov)
      }
      // console.dir(result)
      logBlocks = result

      let newBlock = logBlocks.pop()
      newBlock.meta = {
        epoch: padGen($epoch),
        generation: $generation,
      }
      currentBlocks.push(newBlock)
      currentBlocks = currentBlocks

      // START GAME
      // ***
      // ***
      // ***
      // ***
      // ***
      if (!section || section === "seed") {
        section = "seed"
        if (slug) {
          globalSeed.set(slug)
        }
      }

      if (!$globalSeed) {
        globalSeed.set((random(0, 65535) >>> 0).toString(2))
      }

      life.randomizeFromSeed($globalSeed, Object.keys(postsMap))
      // urlParamsToState()
      // RESIZE
      transitionWorld(0)
      // ***
      // ***
      // ***
      // ***
      // ***
    })
    window.onresize = resizeWorld
  })
</script>

<style lang="scss">
  @import "./variables.scss";

  $WORLD_WIDTH: 29;
  $WORLD_HEIGHT: 29;
  $CELL_DIMENSION: 20px;
  $CELL_DIMENSION_PHONE: 3.2vw;
  $CELL_DIMENSION_SHORT: 20px;

  $SIDEBAR_WIDTH: 400px;

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
    color: $black;
    background: rgb(255, 255, 161);
    display: inline-block;
  }

  .pane {
    height: 100vh;
    position: fixed;
    top: 0;
    height: 100vh;
    overflow-y: scroll;

    &.simulation {
      overflow-y: hidden;
    }

    @include hide-scroll;

    &.left {
      left: 0;
      background: orangered;
      width: 60%;
    }

    &.right {
      left: 60%;
      background: $black;
      width: 40%;
    }
  }

  .world-control {
    height: 50px;
    line-height: 50px;
    position: fixed;
    top: 0;
    width: 60%;
    left: 0;
    font-size: 12px;
    text-align: center;
    display: flex;
    justify-content: center;
    user-select: none;
    background: $white;
    color: $black;

    .control {
      cursor: pointer;
      &.first {
        margin-right: 20px;
      }
      &:hover {
        text-decoration: underline;
      }
    }

    @include screen-size("small") {
      width: 100%;
      display: none;
    }
  }

  .menu {
    position: fixed;
    width: 40%;
    overflow: hidden;
    right: 0;
    color: $black;
    font-size: $font_size_normal;
    text-align: center;
    user-select: none;
    z-index: 100;

    &.top {
      top: 0px;
      height: 50px;
      .menu-item {
        float: left;
        height: 50px;
        line-height: 50px;
        width: 50%;
        cursor: pointer;
        display: block;
        background: $black;
        color: $white;

        &:hover {
          background: rgba(40, 40, 40, 1);
          text-decoration: none;
        }
      }
    }

    @include screen-size("small") {
      top: 50%;
      width: 100vw;
    }
  }

  .list {
    padding-top: 53px;
  }

  .single {
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 80px;
    min-height: 100vh;
    background: grey;

    @include hide-scroll;
  }

  .simulation {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
</style>

{#await posts then posts}
  <div class="landing" use:links>
    <!-- GAME -->
    <div
      class="pane left"
      class:simulation={!slug && section != 'meta'}
      bind:this={paneLeftEl}>
      <!-- PROJECT -->
      {#if section == 'projects' && slug}
        <div class="single">
          <ProjectView
            projectPost={projects.find((p) => get(p, 'slug.current', '') === slug)} />
        </div>
      {/if}

      <!-- AUTHOR -->
      {#if section == 'authors' && slug}
        <div class="single">
          <AuthorView
            authorPost={authors.find((a) => get(a, 'slug.current', '') === slug)} />
        </div>
      {/if}

      <!-- META -->
      {#if section == 'meta' && metaPost}
        <div class="single">
          <MetaView {metaPost} />
        </div>
      {/if}

      <!-- SIMULATION -->
      {#if section != 'projects' && section != 'authors' && section != 'meta'}
        <div class="simulation">
          <World {worldOut} />
        </div>
      {/if}
    </div>

    <!-- INFO PANE -->
    {#if loaded}
      <div class="pane right" bind:this={paneRightEl}>
        <!-- MENU TOP -->
        <div class="menu top">
          <a href="/" class="menu-item half">Projects</a>
          <a href="/meta" class="menu-item half">Meta</a>
        </div>

        <!-- GAME LOG-->
        <!-- {#if UI.state === STATE.GAME}
        <LogList blocks={currentBlocks} />
        {/if} -->

        <!-- AUTHOR LIST -->
        {#if section == 'meta' || section == 'authors'}
          <div class="list">
            <AuthorList {authors} {slug} />
          </div>
        {:else}
          <!-- PROJECT LIST -->
          <div class="list">
            <ProjectsList {projects} {slug} />
          </div>
        {/if}
      </div>
    {/if}
  </div>

  {#if loaded && (!section || section == 'seed')}
    <div class="world-control" use:links>
      <div class="control first">
        {$globalSeed} => {padGen($epoch)}:{padGen($generation)}
      </div>
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
      <a href="/settings" class="control first"> New seed </a>
    </div>
  {/if}

  {#if section == 'settings'}
    <Settings />
  {/if}
{/await}
