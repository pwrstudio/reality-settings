<script>
  // # # # # # # # # # # # # #
  //
  //  LOG LIST
  //
  // # # # # # # # # # # # # #

  import { onMount } from "svelte"
  import { links } from "svelte-routing"
  import { fade } from "svelte/transition"
  import uniq from "lodash/uniq"
  import { quartOut } from "svelte/easing"
  import get from "lodash/get"

  // PROPS
  export let logBlocks = []

  console.dir(logBlocks)
</script>

<style lang="scss">
  @import "./variables.scss";

  .log-list {
    padding-top: 50px;
    .log-item {
      margin-bottom: 20px;
      padding-bottom: 10px;
      width: 100%;
      border-bottom: 1px solid grey;
      line-height: 1.2em;

      .links,
      .epoch {
        color: grey;
        // font-size: $font_size_small;
      }

      .link {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 90%;
        &:hover {
          text-decoration: none;
          color: $black;
        }
      }

      .text {
        margin-bottom: 10px;
        margin-top: 10px;
        // font-size: 32px;
        max-width: 90%;
        line-height: 1.2em;
        word-spacing: -4px;
      }
    }
  }
</style>

<div class="log-list">
  {#each logBlocks as block (block.uid)}
    <div class="log-item" in:fade>
      <div class="epoch">{block.time}</div>
      <div class="text">{block.string}</div>
      <div class="links">
        {#each uniq(block.refs) as ref}
          <a href={'/projects/' + ref.slug} class="link">=> {ref.title}</a>
        {/each}
      </div>
    </div>
  {/each}
</div>
