<script>
  // # # # # # # # # # # # # #
  //
  //  IMAGE BLOCK
  //
  // # # # # # # # # # # # # #

  // IMPORTS
  import { urlFor, renderBlockText } from "../../sanity.js"
  import get from "lodash/get"
  import has from "lodash/has"

  // PROPS
  export let block = {}

  console.dir(block)
</script>

<style lang="scss">
  @import "../../variables.scss";

  .image {
    width: $text_width;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    font-size: $font_size_small;
    line-height: $line-height;
    // font-family: $sans-stack;
    margin-bottom: $line-height;
    // margin-top: 2rem;

    &.fullwidth {
      margin-left: 0;
      margin-right: 0;
      padding-left: 0;
      padding-right: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-height: 80vh;
      }
    }

    &.fullheight {
      width: 100%;
      max-height: unset;
      height: calc(100vh - #{$menu_bar_height});
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 0;
      padding-top: 0;
      img {
        max-height: 90vh;
      }
    }

    &.padded {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    .text {
      // display: flex;
      .caption {
      }

      .attribution {
      }
    }
  }
</style>

<figure class="image">
  <!-- IMAGE -->
  <img src={urlFor(block.image).width(1400).quality(90).auto('format').url()} />

  <!-- CAPTION -->
  <div class="text">
    {#if has(block, 'caption.content')}
      <figcaption class="caption">
        {@html renderBlockText(block.caption.content)}
      </figcaption>
    {/if}
  </div>
</figure>
