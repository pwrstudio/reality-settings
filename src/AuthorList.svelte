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
  export let slug = ""

  // *** DOM REFERENCES
  let logListEl = {}
</script>

<style lang="scss">
  @import "./variables.scss";

  .author-list {
    position: absolute;
    top: 80px;
    height: calc(100vh - 150px);
    padding: 10px;
    width: 100%;
    overflow: scroll;

    @include screen-size("small") {
      padding-bottom: 40px;
    }

    .post {
      margin-bottom: 10px;
      padding: 20px;
      background: #a4a4a4;
      border-radius: 6px;
      display: block;
      cursor: pointer;
      user-select: none;
      text-align: center;
      letter-spacing: -1px;
      border: 2px solid #a4a4a4;

      &:hover {
        transition: background 0.3 ease-out;
        text-decoration: none;
        background: #949494;
        border: 2px solid #949494;
      }

      &.active {
        border: 2px solid orangered;
        &:hover {
          border: 2px solid orangered;
        }
      }

      color: $black;
      font-size: 16px;
      line-height: 1em;
      font-family: "Akkurat-Mono", monospace;
      // -webkit-text-stroke-width: 1px;
      // -webkit-text-stroke-color: $black;
      // letter-spacing: -1px;
    }
  }
</style>

<div class="author-list" use:links>
  {#each authors as author, index (author._id)}
    <a
      href={'/authors/' + author.slug.current}
      class="post"
      class:active={slug === author.slug.current}
      in:fade={{ delay: 40 * index, duration: 200 }}>
      {author.name}
    </a>
  {/each}
</div>
