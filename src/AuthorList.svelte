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
    .post {
      margin-bottom: 3px;
      padding: 20px;
      background: #a4a4a4;
      display: block;
      cursor: pointer;
      user-select: none;
      // text-align: center;
      letter-spacing: -1px;

      &:hover {
        transition: background 0.3 ease-out;
        text-decoration: none;
        background: $white;
      }

      &.active {
        background: $off-white;
      }

      // color: $black;
      // font-size: 16px;
      // line-height: 1em;
      // font-family: "Akkurat-Mono", monospace;
      color: $black;
      font-size: 48px;
      line-height: 0.95em;
      font-family: "five", "helvetica", Arial, "Akkurat-Mono", monospace;
      -webkit-text-stroke-width: 3px;
      -webkit-text-stroke-color: $black;
      letter-spacing: -1px;
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
