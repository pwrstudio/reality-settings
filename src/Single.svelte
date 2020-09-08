<script>
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

<main>
  <div class="project">
    {#await post then post}
      <h1>{post.title}</h1>
      {#if post.authors}
        {#each post.authors as author (author._id)}
          <div class="author">{author.name}</div>
        {/each}
      {/if}
      <div class="main-text">
        {@html renderBlockText(post.mainContent.content)}
      </div>
    {/await}
  </div>
</main>
