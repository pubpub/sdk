<script lang="ts">
  import Id from './Id.svelte'
  let name = ''
</script>

<div
  class="mx-auto flex h-screen w-screen flex-col items-center justify-center gap-20 px-10 md:w-3/4 lg:w-1/2"
>
  <!-- Make a Svelte element which reads "Find your PubPub X ID!" where X is a fancy animated shaded element which is revealed to either be the word "Community", "Pub", or "Collection", changing every two seconds -->
  <h1 class="text-5xl font-bold">
    Find your PubPub
    <span
      class="bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 bg-clip-text text-transparent"
    >
      Community,
    </span>

    <span
      class="bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 bg-clip-text text-transparent"
    >
      Collection,
    </span>
    or
    <span
      class="bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 bg-clip-text text-transparent"
    >
      Pub
    </span>
    ID!
  </h1>

  <form
    on:submit={(e) => {
      name = ''
      console.log(e)
      e.preventDefault()
      // @ts-expect-error why is this not working?
      name = e.target?.[0]?.value ?? ''
    }}
    class="mx-auto w-full"
  >
    <input
      type="text"
      placeholder="Enter the URL to your community, collection, or Pub"
      class="h-12  border-2 border-black bg-white px-5 text-sm focus:outline-none md:min-w-[30vw]"
    />
    <button
      type="submit"
      class="h-12 bg-black py-2 px-4 font-bold text-white hover:bg-gray-700"
    >
      Search
    </button>
  </form>

  {#if name}
    <Id url={name} />
  {/if}
</div>
