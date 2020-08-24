<script>
  import { AuthenticatorAssertionResponse } from 'lodash/_freeGlobal'
  import { urlFor, loadData, renderBlockText } from './sanity.js'

  export let slug = ''

  // VARIABLES
  let query = '*[slug.current == $slug][0]{...,authors[]->{...,name}}'

  // VARIABLES
  let post = loadData(query, { slug: slug })

  post.then((p) => {
    // console.dir(p)
  })
</script>

<style>
  h1 {
    padding: 20px 0px;
  }

  .project {
    width: 900px;
    max-width: 100%;
    margin: 20px;
    margin-right: auto;
    margin-left: auto;
  }

  img {
    max-width: 100%;
  }
</style>

<main>
  <div class="project">
    {#await post then post}
      <h1>{post.title}</h1>
      {#if post.authors}
        {#each post.authors as author (author._id)}
          <div class="author">{author.name}</div>
        {/each}
      {/if}
      {@html renderBlockText(post.mainContent.content)}
    {/await}
  </div>

</main>
