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
  import uniq from "lodash/uniq"
  import flatMap from "lodash/flatMap"
  import Markov from "markov-strings"
  import random from "lodash/random"
  import { v4 as uuidv4 } from "uuid"
  import EasyStar from "easystarjs"
  import { fade } from "svelte/transition"
  import MediaQuery from "svelte-media-query"

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
  import LogOutput from "./LogOutput.svelte"
  import ProjectView from "./ProjectView.svelte"
  import AuthorView from "./AuthorView.svelte"
  import CategoryView from "./CategoryView.svelte"
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
  let keywords = []
  let allCategories = []
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
  let logOut = {}

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
    if (path.length > 0) {
      const currentPoint = path.shift()
      const pointIndex = currentPoint.x + WORLD.WIDTH * currentPoint.y
      worldOut[pointIndex] = 2
      requestAnimationFrame(() => {
        drawPath(path)
      })
    } else {
      // Make block

      //   currentBlocks.push(newBlock)

      // if (logBlocks.length > 0) {
      //   let newBlock = logBlocks.pop()
      //   newBlock.meta = {
      //     epoch: padGen($epoch),
      //     generation: $generation,
      //   }

      //   currentBlocks = currentBlocks
      // }
      logOut = generateBlock()
      logBlocks = [logOut, ...logBlocks]
      console.dir(logOut)
      setTimeout(() => {
        logOut = false
      }, 6000)
      // setTimeout(() => {
      //   logOut = false
      // }, 3000)

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
            logOut = false
            drawPath(path)
          } else {
            console.log("no path")
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

  let generateBlock = () => {}

  // Load data
  let postsMap = {}
  let metaPost = false
  let projects = []
  let authors = []
  let posts = loadData(QUERY.ALL)

  onMount(async () => {
    posts.then((posts) => {
      metaPost = posts.find((p) => p._type === "introduction")
      // AUTHORS
      authors = posts.filter((p) => p._type === "author")
      authors = Array.isArray(authors) ? authors.sort() : []
      // PROJECTS
      projects = posts.filter((p) => p._type === "project")
      projects = Array.isArray(projects) ? shuffle(projects) : []

      projects.forEach((post) => {
        allCategories = [...allCategories, ...get(post, "categories", [])]

        if (toPlainText(post.mainContent.content).length > 10) {
          allTextOnly =
            allTextOnly +
            toPlainText(post.mainContent.content)
              .replace(/\r?\n|\r/g, " ")
              .trim()
        }

        let sentences = allTextOnly.match(/[^\.!\?]+[\.!\?]+/g)
        if (sentences) {
          sentences = sentences.map((s) => {
            return {
              string: s.trim(),
              title: post.title,
              slug: "/projects/" + post.slug.current,
            }
          })
          allSentences = [...allSentences, ...sentences]
        }
      })

      // INCLUDE META TEXT
      if (toPlainText(metaPost.mainContent.content).length > 10) {
        allTextOnly =
          allTextOnly +
          toPlainText(metaPost.mainContent.content)
            .replace(/\r?\n|\r/g, " ")
            .trim()
      }

      let sentences = allTextOnly.match(/[^\.!\?]+[\.!\?]+/g)
      if (sentences) {
        sentences = sentences.map((s) => {
          return {
            string: s.trim(),
            title: "Meta",
            slug: "/meta",
          }
        })
        allSentences = [...allSentences, ...sentences]
      }

      allCategories = uniq(allCategories)
      console.dir(allSentences)

      // markovMaterial = allTextOnly
      //   .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
      //   .split("|")

      // console.dir(markovMaterial)

      // Build the Markov generator
      const markov = new Markov(allSentences, { stateSize: 2 })

      markov.buildCorpus()

      const options = {
        maxTries: 200,
        filter: (result) => {
          return (
            result.string.split(" ").length <= 30 &&
            // result.score > 10 &&
            uniq(result.refs).length > 1 &&
            (result.string.endsWith(".") ||
              result.string.endsWith("?") ||
              result.string.endsWith("!"))
          )
        },
      }

      generateBlock = () => {
        return {
          ...markov.generate(options),
          uid: uuidv4(),
          time: padGen($epoch),
        }
      }

      // ***
      // START GAME
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
      // RESIZE
      transitionWorld(0)
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

  .pane {
    height: 100vh;
    position: fixed;
    top: 0;
    height: 100vh;
    overflow-y: scroll;

    @include screen-size("small") {
      height: calc(100vh - 60px);
      top: 60px;
    }

    &.simulation {
      overflow-y: hidden;
    }

    @include hide-scroll;

    &.left {
      left: 0;
      background: orangered;
      width: 60%;
      @include screen-size("small") {
        width: 100%;
        left: 0;
      }
    }

    &.right {
      left: 60%;
      background: $black;
      width: 40%;
      @include screen-size("small") {
        top: 0;
        width: 100%;
        left: 0;
        height: 100vh;
      }
    }
  }

  .world-control {
    height: 50px;
    line-height: 50px;
    position: fixed;
    top: 0;
    width: 60%;
    left: 0;
    font-size: $font-size-small;
    text-align: center;
    display: flex;
    justify-content: center;
    user-select: none;
    background: $white;
    color: $black;

    .control {
      cursor: pointer;
      &.first {
        margin-right: 15px;
      }
      &:hover {
        text-decoration: underline;
      }
    }

    @include screen-size("small") {
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

      @include screen-size("small") {
        height: 60px;
        line-height: 60px;
      }
    }

    @include screen-size("small") {
      height: 60px;
    }

    @include screen-size("small") {
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
    height: 100vh;
    background: grey;

    &.white {
      background: $white;
    }

    overflow-y: auto;

    @include hide-scroll;
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

      <!-- CATEGORY -->
      {#if section == 'categories' && slug}
        <div class="single">
          <CategoryView {slug} />
        </div>
      {/if}

      <!-- META -->
      {#if section == 'meta' && metaPost}
        <div class="single">
          <MetaView {metaPost} />
        </div>
      {/if}

      <!-- LOG LIST -->
      {#if section == 'log'}
        <div class="single white">
          <LogList {logBlocks} />
        </div>
      {/if}

      <!-- SIMULATION -->
      {#if !slug && section != 'authors' && section != 'meta' && section != 'categories' && section != 'log'}
        <div class="simulation">
          <World {worldOut} />
        </div>
      {/if}
    </div>

    <!-- INFO PANE -->
    {#if loaded}
      <!-- MENU TOP -->
      <div class="menu top">
        <a href="/projects" class="menu-item half">Projects</a>
        <a href="/meta" class="menu-item half">Meta</a>
      </div>

      <!-- AUTHOR LIST -->
      <MediaQuery query="(min-width: 800px)" let:matches>
        {#if matches}
          {#if section == 'meta' || section == 'authors'}
            <div class="pane right">
              <div class="list">
                <AuthorList {authors} {slug} />
              </div>
            </div>
          {:else}
            <!-- PROJECT LIST -->
            <div class="pane right">
              <div class="list">
                <ProjectsList {projects} {slug} />
              </div>
            </div>
          {/if}
        {:else}
          <!-- PROJECT LIST -->
          {#if section == 'projects' && !slug}
            <div class="pane right">
              <div class="list">
                <ProjectsList {projects} {slug} />
              </div>
            </div>
          {/if}
        {/if}
      </MediaQuery>
    {/if}
  </div>

  {#if loaded && (!section || section == 'seed' || section == 'log' || (section == 'projects' && !slug))}
    <div class="world-control" use:links>
      <div class="control first">{$globalSeed} => {padGen($generation)}</div>
      <!-- {#if running}
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
      {/if} -->
      <div
        class="control first"
        on:click={() => {
          resetWorld()
        }}>
        Reset
      </div>
      <a href="/settings" class="control first">New seed</a>
    </div>

    <!-- LOG OUTPUT -->
    {#if logOut && logOut.string && section != 'log'}
      <span use:links>
        <LogOutput {logOut} />
      </span>
    {/if}
  {/if}

  {#if section == 'settings'}
    <Settings />
  {/if}
{/await}
