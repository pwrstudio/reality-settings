<script>
  // # # # # # # # # # # # # #
  //
  //  LOG LIST
  //
  // # # # # # # # # # # # # #

  // IMPORTS
  import { fade } from "svelte/transition"
  import { navigate } from "svelte-routing"

  // *** PROPS
  export let blocks = []

  // *** DOM REFERENCES
  let logListEl = false

  $: {
    if (blocks && logListEl) {
      setTimeout(() => {
        logListEl.scrollTo({
          top: logListEl.scrollHeight,
          left: 0,
          behavior: "smooth",
        })
      }, 100)
    }
  }
</script>

<style lang="scss">
  @import "./variables.scss";

  .log-list {
    position: absolute;
    top: 80px;
    height: calc(100vh - 120px);
    padding: 0;
    width: 100%;
    font-size: 12px;
    overflow: scroll;
    @include screen-size("small") {
      padding-bottom: 40px;
    }
  }

  .post {
    margin: 10px;
    margin-bottom: 10px;
    padding: 20px;
    background: #a4a4a4;
    border-radius: 20px;
    display: block;
    font-size: 12px;
    cursor: pointer;
    user-select: none;

    &:hover {
      transition: background 0.3s ease-out;
      text-decoration: none;
      background: #949494;
    }

    .title {
      line-height: 1em;
      font-family: "Akkurat-Mono", monospace;
    }

    .meta {
      margin-bottom: 10px;
      span {
        border-bottom: 1px solid black;
      }
    }
  }
</style>

<div class="log-list" bind:this={logListEl}>
  {#each blocks as block (block.uid)}
    <div
      class="post"
      on:click={(e) => {
        navigate('/projects/im-not-in-love-towards-expressive-anamophisms-in-music')
      }}>
      <div class="meta"><span>{block.meta.epoch}</span></div>
      <div class="title">{block.string}</div>
    </div>
  {/each}
</div>
