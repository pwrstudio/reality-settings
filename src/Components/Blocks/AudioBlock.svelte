<script>
  // # # # # # # # # # # # # #
  //
  //  ADUIO BLOCK
  //
  // # # # # # # # # # # # # #

  // IMPORTS
  import has from "lodash/has";
  import { urlFor, loadData, renderBlockText } from "../../sanity.js";

  const PROJECT_ID = "hixs580y";

  // PROPS
  export let block = {};

  const audioUrl =
    "https://cdn.sanity.io/files/" +
    PROJECT_ID +
    "/production/" +
    block.audioFile.asset._ref.replace("file-", "").replace("-mp3", ".mp3");
</script>

<style lang="scss">
  @import "../../variables.scss";

  .audio {
    width: $text_width;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    font-size: $font_size_small;
    line-height: $line-height;
    font-family: $sans-stack;
    margin-bottom: $line-height;
    margin-top: $line-height;

    audio {
      width: 100%;
      border-radius: 0px;
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

<figure class="audio">

  <!-- VIDEO -->
  <audio src={audioUrl} controls />

  <!-- CAPTION -->
  {#if has(block, 'caption.content')}
    <figcaption class="caption">
      {@html renderBlockText(block.caption.content)}
    </figcaption>
  {/if}

  <!-- ATTRIBUTION  -->
  {#if has(block, 'attribution')}
    <figcaption class="attribution">{block.attribution}</figcaption>
  {/if}

</figure>
