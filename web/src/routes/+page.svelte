<script lang="ts">
  import Id from './Id.svelte'
  let name = ''
</script>

<div
  class="flex h-screen w-screen flex-col items-center justify-center gap-20 bg-pink-100"
>
  <h1 class="text-4xl font-bold">Find your PubPub community ID!</h1>
  <form
    on:submit={(e) => {
      name = ''
      console.log(e)
      e.preventDefault()
      // @ts-expect-error why is this not working?
      name = e.target?.[0]?.value ?? ''
    }}
  >
    <input
      type="text"
      placeholder="Enter the URL to your PubPub community"
      class="h-12 min-w-[30vw] max-w-7xl border-2 border-black bg-white px-5 text-sm focus:outline-none"
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
