<script>
  // # # # # # # # # # # # # #
  //
  //  AUTHOR LIST
  //
  // # # # # # # # # # # # # #

  // IMPORTS
  import { fade } from "svelte/transition"
  import { links } from "svelte-routing"

  // *** PROPS
  export let authors = []

  // *** DOM REFERENCES
  let logListEl = {}
</script>

<style lang="scss">
  @import "./variables.scss";

  .author-list {
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
    margin: 5px;
    margin-bottom: 10px;
    padding: 20px;
    background: #a4a4a4;
    border-radius: 20px;
    display: block;
    font-size: 12px;
    cursor: pointer;
    user-select: none;

    &:hover {
      transition: background 0.3 ease-out;
      text-decoration: none;
      background: #949494;
    }

    .title {
      // max-width: 240px;
      // font-size: 16px;
      line-height: 1em;
      // font-family: 'five', 'Akkurat-Mono', monospace;
      font-family: "Akkurat-Mono", monospace;
    }

    .authors {
      margin-top: 0.5em;
    }
  }
</style>

<div class="author-list" use:links>
  {#each authors as author}
    <a href={'/authors/' + author.slug.current} class="post" in:fade>
      <div class="title">{author.name}</div>
    </a>
  {/each}
</div>
