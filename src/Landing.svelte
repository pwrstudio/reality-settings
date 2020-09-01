<script>
  import { onMount } from "svelte";
  import { links } from "svelte-routing";
  import { fade } from "svelte/transition";
  import { Life } from "dat-life";
  import has from "lodash/has";
  import shuffle from "lodash/shuffle";
  import flatMap from "lodash/flatMap";
  import Markov from "markov-strings";
  import { v4 as uuidv4 } from "uuid";

  import {
    urlFor,
    loadData,
    renderBlockText,
    toPlainText,
    singleToPlainText
  } from "./sanity.js";

  // STORES
  import { running, globalSeed, globalHeat, generation } from "./stores.js";

  // PROPS
  export let seed = false;
  export let heat = false;
  export let start = false;

  // COMPONENTS
  import ImageBlock from "./Components/Blocks/ImageBlock.svelte";
  import VideoBlock from "./Components/Blocks/VideoBlock.svelte";
  import AudioBlock from "./Components/Blocks/AudioBlock.svelte";
  import EmbedBlock from "./Components/Blocks/EmbedBlock.svelte";
  import Molecule from "./Components/Molecule.svelte";
  import Ball from "./Components/Ball.svelte";

  // CONSTANTS
  const query = '*[_type == "project"]';
  const authorQuery = '*[_type == "author"]';

  // VARIABLES
  let posts = loadData(query);
  let authors = loadData(authorQuery);
  let blocks = [];
  let testBlocks = [];
  let currentBlocks = [];
  let postsMap = {};
  let keywords = [];
  let allTextOnly = "";
  let markovMaterial = [];
  let landingContainerEl = {};

  let cells = [];

  let zoomed = false;

  let allSentences = [];

  const life = new Life(39, 39);

  // console.dir(life);

  // for (let row = 0; row < 39; row++) {
  //   cells.push([]);
  //   for (let column = 0; column < 39; column++) {
  //     cells[row].push({
  //       y: row,
  //       x: column,
  //       active: false,
  //       id: uuidv4()
  //     });
  //   }
  // }

  // console.dir(cells);

  let conGen = 0;
  let worldOut = [];
  life.randomize();

  for (let i = 0; i < 1521; i++) {
    setTimeout(() => {
      console.log(i);
      worldOut.push(life.board[i]);
      worldOut = worldOut;
    }, i * 0.5);
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

  globalSeed.set(seed);

  posts.then(posts => {
    // console.dir(posts);
    posts.forEach(post => {
      // Add to map
      postsMap[post._id] = post;

      if (toPlainText(post.mainContent.content).length > 10) {
        allTextOnly =
          allTextOnly +
          toPlainText(post.mainContent.content)
            .replace(/\r?\n|\r/g, " ")
            .trim();
      }

      // console.log(toPlainText(post.mainContent.content));
      // console.log(post.title);
      // console.log(allTextOnly);

      let sentences = allTextOnly.match(/[^\.!\?]+[\.!\?]+/g);

      if (sentences) {
        sentences = sentences.map(s => {
          return { text: s.trim(), title: post.title, slug: post.slug.current };
        });
        // console.dir(sentences);

        allSentences = [...allSentences, ...sentences];
      }

      // Get all blocks
      post.mainContent.content.forEach(block => {
        // console.log(singleToPlainText(block).length)
        if (block._type !== "block" || singleToPlainText(block).length > 0) {
          blocks.push({
            id: post._id,
            uid: uuidv4(),
            content: block
          });
        }
        // if (block._type == "block") {
        //   console.dir(block);
        // }
      });

      // KEYWORDS
      let children = flatMap(
        post.mainContent.content
          .filter(c => c._type == "block")
          .map(b => b.children)
      );

      console.dir(children);

      children.forEach(c => {
        if (c.marks.length > 0 && c.marks.includes("keyword")) {
          // console.dir(c)
          keywords.push(c.text);
        }
      });

      // let b = a.map(x => x);

      // console.dir(b);

      // keywords = [...keywords, ...a.filter(x => x._type === "keyword")];
    });

    console.dir(keywords);
    keywords = keywords;

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

    testBlocks = shuffle(blocks);
    // allSentences = shuffle(allSentences);

    // currentBlocks.push(testBlocks.pop());
    currentBlocks = testBlocks;

    // setInterval(() => {
    //   currentBlocks.push(testBlocks.pop());
    //   currentBlocks = currentBlocks;
    // }, 5000);

    // console.dir(testBlocks);

    // console.dir(keywords)
  });

  // function updateGen() {
  //   // for (row in cells) {
  //   //   for (col in cells[row]) {
  //   //     console.dir(cells[row][col]);
  //   //     // // Update the current generation with
  //   //     // // the results of createNextGen function
  //   //     // currGen[row][col] = nextGen[row][col];
  //   //     // // Set nextGen back to empty
  //   //     // nextGen[row][col] = 0;
  //   //   }
  //   // }

  //   for (let row = 0; row < 39; row++) {
  //     for (let column = 0; column < 39; column++) {
  //       // console.dir(cells[row][column]);
  //     }
  //   }
  // }

  // function getNeighborCount(row, col) {
  //   let count = 0;
  //   let nrow = Number(row);
  //   let ncol = Number(col);

  //   // Make sure we are not at the first row
  //   if (nrow - 1 >= 0) {
  //     // Check top neighbor
  //     if (currGen[nrow - 1][ncol] == 1) count++;
  //   }
  //   // Make sure we are not in the first cell
  //   // Upper left corner
  //   if (nrow - 1 >= 0 && ncol - 1 >= 0) {
  //     //Check upper left neighbor
  //     if (currGen[nrow - 1][ncol - 1] == 1) count++;
  //   }
  //   // Make sure we are not on the first row last column
  //   // Upper right corner
  //   if (nrow - 1 >= 0 && ncol + 1 < cols) {
  //     //Check upper right neighbor
  //     if (currGen[nrow - 1][ncol + 1] == 1) count++;
  //   }
  //   // Make sure we are not on the first column
  //   if (ncol - 1 >= 0) {
  //     //Check left neighbor
  //     if (currGen[nrow][ncol - 1] == 1) count++;
  //   }
  //   // Make sure we are not on the last column
  //   if (ncol + 1 < cols) {
  //     //Check right neighbor
  //     if (currGen[nrow][ncol + 1] == 1) count++;
  //   }
  //   // Make sure we are not on the bottom left corner
  //   if (nrow + 1 < rows && ncol - 1 >= 0) {
  //     //Check bottom left neighbor
  //     if (currGen[nrow + 1][ncol - 1] == 1) count++;
  //   }
  //   // Make sure we are not on the bottom right
  //   if (nrow + 1 < rows && ncol + 1 < cols) {
  //     //Check bottom right neighbor
  //     if (currGen[nrow + 1][ncol + 1] == 1) count++;
  //   }

  //   // Make sure we are not on the last row
  //   if (nrow + 1 < rows) {
  //     //Check bottom neighbor
  //     if (currGen[nrow + 1][ncol] == 1) count++;
  //   }

  //   return count;
  // }

  // updateGen();

  const padGen = number =>
    number <= 999999 ? `00000${number}`.slice(-6) : number;

  onMount(async () => {
    setTimeout(() => {
      setInterval(() => {
        // conGen++;
        // console.log(conGen);
        generation.set($generation + 1);
        life.next();
        worldOut = life.board;
      }, 200);
    }, 5000);
  });
</script>

<style lang="scss">
  @import "./variables.scss";

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
      width: 75%;
    }

    &.right {
      // width: 33.33%;
      left: 75%;
      // left: 66.66%;
      background: grey;
      background: lightgray;
      padding: 20px;
      padding-top: 60px;
      width: calc(26% - 40px);
      overflow-y: scroll;
      height: calc(100vh - 80px);
    }
  }

  .world {
    width: 585px;
    height: 585px;
    width: 46.8vw;
    height: 46.8vw;
    background: grey;
    // transform: scale(1.45);
    // transition: transform 0.5s ease-out;
    // will-change: transform;

    &.zoomed {
      transform: scale(6) rotateZ(45deg);
    }
  }

  .cell {
    height: 1.2vw;
    width: 1.2vw;
    border-radius: 1.2vw;
    line-height: 1.2vw;

    // display: inline-block;
    float: left;
    background: #c4c4c4;
    background: #a4a4a4;
    font-size: 2px;
    text-align: center;
    color: #333333;
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
      border-radius: 4px;

      // transition: background 0.3s ease-out;
      background: red;
      // transform: rotateZ(90deg);
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
    height: 80px;
    line-height: 80px;
    position: fixed;
    bottom: 0;
    width: 75%;
    left: 0;
    // background: #a4a4a4;
    font-size: 12px;
    // padding-left: 20px;
    text-align: center;
  }

  .top-bar {
    height: 40px;
    line-height: 40px;
    position: fixed;
    top: 0;
    width: 25%;
    right: 0;
    background: #a4a4a4;
    font-size: 12px;
    // padding-left: 20px;
    text-align: center;
  }

  .post {
    margin: 5px;
    padding: 10px;
    background: #a4a4a4;
    border-radius: 20px;
    display: inline-block;
    font-size: 12px;
    // max-width: 300px;
    display: inline-flex;
    align-items: center;
  }

  .icon {
    height: 20px;
    width: 20px;
    border-radius: 20px;
    background: red;
    margin-right: 10px;
  }

  .avatar {
    height: 20px;
    width: 20px;
    border-radius: 20px;
    background: #00ff00;
    margin-right: 10px;
  }

  .key {
    height: 20px;
    width: 20px;
    border-radius: 20px;
    background: #ffff00;
    margin-right: 10px;
  }

  .title {
    max-width: 240px;
  }
</style>

<div class="landing" use:links bind:this={landingContainerEl}>

  <div class="pane left">
    <div
      class="world"
      class:zoomed
      on:click={() => {
        zoomed = !zoomed;
      }}>

      <!-- {#each cells as row}
          {#each row as c (c.id)}
            <div
              class="cell"
              data-x={c.x}
              data-y={c.y}
              on:click={e => (c.active = !c.active)}
              class:active={c.active}
              id={c.id} />
          {/each}
        {/each} -->

      {#each worldOut as cell, index}
        <div
          class="cell"
          data-index={index}
          data-x={index % 39}
          on:click={() => {
            console.log('CLICKED');
            life.set(index % 39, Math.floor(index / 39), !cell);
          }}
          data-y={Math.floor(index / 39)}
          class:alive={cell == 1}>
          <span class="text">{index}</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="pane right">

    {#each keywords as keyword}
      <span class="post" in:fade>
        <div class="key" />
        <div class="title">{keyword}</div>
      </span>
    {/each}

    {#await posts then posts}
      {#each posts as post}
        <a href={'/project/' + post.slug.current} class="post" in:fade>
          <div class="icon" />
          <div class="title">{post.title}</div>
        </a>
      {/each}
    {/await}

    {#await authors then authors}
      {#each authors as author}
        <span class="post" in:fade>
          <div class="avatar" />
          <div class="title">{author.name}</div>
        </span>
      {/each}
    {/await}

  </div>

</div>

<div class="bottom-bar">Gen=>{padGen($generation)}</div>

<div class="top-bar">Reality Settings / Seed => {$globalSeed}</div>
