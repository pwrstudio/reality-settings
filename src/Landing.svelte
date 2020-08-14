<script>
  import { links } from "svelte-routing";

  import has from "lodash/has";
  import { urlFor, loadData, renderBlockText } from "./sanity.js";

  // VARIABLES
  let query = '*[_type == "project"]';

  // VARIABLES
  let posts = loadData(query);
</script>

<style>
  h1 {
    padding: 20px;
  }

  .project {
    width: 600px;
    max-width: 100%;
    margin: 20px;
  }

  img {
    max-width: 100%;
  }
</style>

<div class="project" use:links>

  {#await posts then posts}
    {#each posts as p (p._id)}
      <div>
        <a href={p.slug.current}>{p.title}</a>
      </div>
      <!-- {@html renderBlockText(p.mainContent.content)} -->
    {/each}
  {/await}

  <div>
    <a href="arena">Arena</a>
  </div>

  <div>
    <a href="text">Text</a>
  </div>

</div>
