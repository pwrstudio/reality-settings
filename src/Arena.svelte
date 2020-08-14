<script>
  import Arena from "are.na";
  import has from "lodash/has";

  const arena = new Arena();

  let channelContent = false;
  //   let channelConnections = []

  arena
    .channel("reality-settings-references")
    .get()
    .then(chan => {
      //   chan.contents.map((item) => {
      //     console.dir(item)
      //   })
      channelContent = chan.contents;
    })
    .catch(err => console.log(err));

  //   arena
  //     .channel('data-architecture')
  //     .connections()
  //     .then((conn) => {
  //       channelConnections = conn
  //     })
  //     .catch((err) => console.log(err))
</script>

<style>
  h1 {
    padding: 20px;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
  }
  .block {
    width: 300px;
    height: auto;
    background: lightgray;
    padding: 20px;
    font-size: 14px;
    margin: 20px;
  }

  .title {
    font-weight: bold;
    margin-bottom: 1em;
  }

  .description {
    word-break: break-all;
    margin-bottom: 1em;
  }

  img {
    max-width: 100%;
  }
</style>

<div class="container">
  {#if channelContent}
    {#each channelContent as block (block.id)}
      <div class="block">
        <div class="title">{block.title}</div>
        <div class="description">{block.content}</div>
        <div class="description">{block.description}</div>
        {#if has(block, 'image.large.url')}
          <div class="image">
            <img src={block.image.large.url} />
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div>
