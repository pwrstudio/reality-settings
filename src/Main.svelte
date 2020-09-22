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
    STATE,
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

  // *** PROPS
  export let params = false

  let section = false
  let slug = false

  $: {
    // Split URL parameters
    console.log("PARAMS updated")
    console.dir(params)
    const args = get(params, "[*]", "").split("/")
    let section = args[0] && args[0].length > 0 ? args[0] : "seed"
    let slug = args[1] && args[1].length > 0 ? args[1] : false
    urlParamsToState()
  }

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
  let inSession = false

  // *** DOM REFERENCES
  let worldEl = {}
  let paneEl = {}

  // UI STATE
  const UI = { state: false, slug: false, errorMessage: false }

  const setUIState = (newState, newSlug = false, errorMessage = false) => {
    switch (newState) {
      case STATE.GAME:
        UI.state = STATE.GAME
        UI.slug = $globalSeed
        resizeWorld()
        if (inSession) {
          startWorld()
        } else {
          transitionWorld(0)
        }
        history.pushState({}, "", "/seed/" + $globalSeed)
        break
      case STATE.PROJECTS:
        UI.state = STATE.PROJECTS
        UI.slug = false
        startWorld()
        history.pushState({}, "", "/projects")
        break
      case STATE.META:
        UI.state = STATE.META
        UI.slug = false
        stopWorld()
        history.pushState({}, "", "/meta")
        break
      case STATE.SINGLE_PROJECT:
        UI.state = STATE.SINGLE_PROJECT
        UI.slug = newSlug
        stopWorld()
        projectPost = false
        setTimeout(() => {
          projectPost = projects.find((p) => p.slug.current == UI.slug)
        }, 100)
        history.pushState({}, "", "/projects/" + UI.slug)
        break
      case STATE.SINGLE_AUTHOR:
        UI.state = STATE.SINGLE_AUTHOR
        UI.slug = newSlug
        stopWorld()
        authorPost = false
        setTimeout(() => {
          authorPost = authors.find((p) => p.slug.current == slug)
        }, 100)
        history.pushState({}, "", "/authors/" + UI.slug)
        break
      default:
        UI.state = STATE.ERROR
        UI.slug = false
        UI.errorMessage = errorMessage
        history.pushState({}, "", "/error/")
    }
  }

  $: {
    console.log("STATE: ", UI.state)
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
      inSession = true
      setTimeout(() => {
        startWorld()
        // advanceWorld($generation + 1)
      }, 500)
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

      // setTimeout(() => {
      //   startWorld()
      // }, 2000)
      // setTimeout(() => {
      //   advanceWorld(gen + 1)
      // }, 2000)
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

  // Load data
  let postsMap = {}
  let projectPost = false
  let authorPost = false
  let metaPost = false
  let projects = []
  let authors = []
  let posts = loadData(QUERY.ALL)

  // $: {
  //   if (metaPost && (section || slug)) {
  //     urlParamsToState()
  //   }
  // }

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

  const urlParamsToState = () => {
    console.log("URL TO PARAMS !!!")
    switch (section) {
      case "seed":
        setUIState(STATE.GAME, slug)
        break
      case "projects":
        slug
          ? setUIState(STATE.SINGLE_PROJECT, slug)
          : setUIState(STATE.PROJECTS)
        break
      case "authors":
        slug ? setUIState(STATE.SINGLE_AUTHOR, slug) : setUIState(STATE.META)
        break
      case "meta":
        setUIState(STATE.META)
        break
      default:
        setUIState(STATE.GAME)
    }
  }

  onMount(async () => {
    posts.then((posts) => {
      // console.dir(posts)
      metaPost = posts.find((p) => p._type === "introduction")
      authors = posts.filter((p) => p._type === "author")
      projects = posts.filter((p) => p._type === "project")

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
      if (section === "seed" && slug) {
        globalSeed.set(slug)
      } else {
        globalSeed.set((random(0, 65535) >>> 0).toString(2))
      }
      life.randomizeFromSeed($globalSeed, Object.keys(postsMap))
      urlParamsToState()
      // RESIZE
      resizeWorld()
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
    color: $black;
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
      background: orangered;
      // background: rgba(255, 0, 0, 1);
      // background: $black;
      width: 60%;
      overflow: hidden;

      @include screen-size("small") {
        width: 100vw;
        height: 50vh;
      }
    }

    &.right {
      opacity: 1;
      left: 60%;
      background: lightgray;
      background: $black;
      // background:
      width: 40%;
      overflow-y: scroll;
      height: 100vh;

      @include hide-scroll;

      @include screen-size("small") {
        width: calc(100vw - 20px);
        height: calc(50vh - 90px);
        left: 0;
        top: 50%;
      }
    }
  }

  .world-control {
    height: 20px;
    line-height: 20px;
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
    font-size: 16px;
    text-align: center;
    user-select: none;
    z-index: 100;

    &.top {
      top: 0px;
      height: 70px;
      .menu-item {
        height: 70px;
        line-height: 70px;
        cursor: pointer;
        display: block;
        background: $black;
        color: $white;
        // font-family: "five", "Akkurat-Mono", monospace;
        // font-size: 56px;
        // font-weight: normal;
        // color: orangered;
        // -webkit-text-stroke-color: orangered;
        // -webkit-text-stroke-width: 4px;

        &:hover {
          // text-decoration: none;
        }
      }
    }

    &.bottom {
      line-height: 70px;
      bottom: 0px;
      height: 70px;
      border-bottom: none;
      .menu-item {
        height: 70px;
        line-height: 70px;
        cursor: pointer;
        display: block;
        background: $black;
        color: $white;

        // border-radius: 6px;

        // font-family: "five", "Akkurat-Mono", monospace;
        // font-size: 56px;
        // font-weight: normal;
        // color: orangered;
        // -webkit-text-stroke-color: orangered;
        // -webkit-text-stroke-width: 4px;

        &:hover {
          // text-decoration: none;
        }
      }
    }

    @include screen-size("small") {
      top: 50%;
      width: 100vw;
    }
  }

  .projects-list {
    position: absolute;
    top: 0px;
    height: 100vh;
    // padding: 10px;
    padding-top: 73px;
    padding-bottom: 70px;
    width: 100%;
    font-size: 12px;
    overflow: scroll;
    @include screen-size("small") {
      padding-bottom: 40px;
    }
  }
</style>

<div class="landing">
  <!-- GAME -->
  <div class="pane left" bind:this={paneEl}>
    {#if UI.state === STATE.GAME || UI.state === STATE.PROJECTS}
      <World {worldOut} />
    {/if}

    <!-- PROJECT -->
    {#if UI.state === STATE.SINGLE_PROJECT && projectPost}
      <ProjectView {projectPost} />
    {/if}

    <!-- AUTHOR -->
    {#if UI.state === STATE.SINGLE_AUTHOR && authorPost}
      <AuthorView {authorPost} />
    {/if}

    <!-- META -->
    {#if UI.state === STATE.META && metaPost}
      <MetaView {metaPost} />
    {/if}
  </div>

  <!-- INFO PANE -->
  {#await posts then posts}
    {#if inSession}
      <div class="pane right">
        <!-- MENU TOP -->
        <div class="menu top">
          {#if UI.state === STATE.GAME || UI.state === STATE.META || UI.state === STATE.SINGLE_AUTHOR}
            <div
              class="menu-item"
              on:click={() => {
                setUIState(STATE.PROJECTS)
              }}>
              Projects
            </div>
          {/if}
          {#if UI.state === STATE.PROJECTS || UI.state === STATE.SINGLE_PROJECT}
            <div
              class="menu-item"
              on:click={() => {
                setUIState(STATE.GAME)
              }}>
              World
            </div>
          {/if}
        </div>

        <!-- GAME LOG-->
        <!-- {#if UI.state === STATE.GAME}
        <LogList blocks={currentBlocks} />
      {/if} -->

        <!-- PROJECT LIST -->
        {#if UI.state === STATE.GAME || UI.state === STATE.PROJECTS || UI.state === STATE.SINGLE_PROJECT}
          <div class="projects-list">
            <ProjectsList {projects} slug={UI.slug} />
          </div>
        {/if}

        <!-- AUTHOR LIST -->
        {#if UI.state === STATE.META || UI.state === STATE.SINGLE_AUTHOR}
          <AuthorList {authors} slug={UI.slug} />
        {/if}

        <!-- MENU BOTTOM -->
        <div class="menu bottom">
          {#if UI.state === STATE.META}
            <div
              class="menu-item"
              on:click={() => {
                setUIState(STATE.GAME)
              }}>
              X
            </div>
          {:else}
            <div
              class="menu-item"
              on:click={() => {
                setUIState(STATE.META)
              }}>
              Meta
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {/await}
</div>

{#if UI.state === STATE.GAME || UI.state === STATE.PROJECTS}
  <div class="world-control">
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
    <div
      class="control first"
      on:click={() => {
        resetWorld()
      }}>
      New seed
    </div>
  </div>
{/if}
