<script>
  // # # # # # # # # # # # # #
  //
  //  TSoaP Client
  //
  // # # # # # # # # # # # # #

  // IMPORTS
  import { onMount } from "svelte";

  import { Router, Route } from "svelte-routing";
  import * as Colyseus from "colyseus.js";
  import { fade, fly } from "svelte/transition";

  // ROUTES
  import Arena from "./Arena.svelte";
  import Landing from "./Landing.svelte";
  import Single from "./Single.svelte";

  // const client = new Colyseus.Client("ws://18.194.21.39:6666");
  const client = new Colyseus.Client("wss://rs.scarmonger.xyz");
  // const client = new Colyseus.Client("wss://18.194.21.39:3000");

  let localPlayers = {};
  let mainRoom = {};

  const sendClick = e => {
    console.dir(e);
    mainRoom.send("click", { x: e.clientX, y: e.clientY });
  };

  onMount(async () => {
    mainRoom = await client.joinOrCreate("main", {});

    mainRoom.state.players.onRemove = (player, sessionId) => {
      try {
        delete localPlayers[sessionId];
        localPlayers = localPlayers;
      } catch (err) {
        console.log(err);
      }
    };

    // ADD
    mainRoom.state.players.onAdd = (player, sessionId) => {
      localPlayers[sessionId] = sessionId;
    };

    // STATE CHANGE
    mainRoom.state.players.onChange = function(player, sessionId) {
      console.dir(player);
    };

    mainRoom.onMessage("click", message => {
      console.dir(message.x);
      console.dir(message.y);
      var newDiv = document.createElement("div");
      newDiv.style.height = "30px";
      newDiv.style.borderRadius = "30px";
      newDiv.style.opacity = 0.75;
      newDiv.style.width = "30px";
      newDiv.style.backgroundColor = "#ff0000";
      newDiv.style.position = "fixed";
      newDiv.style.top = message.y + "px";
      newDiv.style.left = message.x + "px";
      document.body.appendChild(newDiv);
    });

    // ERROR
    mainRoom.onError((code, message) => {
      console.error("!!! COLYSEUS ERROR:");
      console.error(message);
    });
  });
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

<svelte:window on:click={sendClick} />

<main>
  <Router>
    <Route path="/" component={Landing} />
    <Route path="/arena" component={Arena} />
    <Route path="/text" component={Arena} />
    <Route path="/:slug" component={Single} />
  </Router>
</main>
