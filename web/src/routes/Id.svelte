<script lang="ts">
  export let url: string

  async function update(url: string) {
    const params = new URLSearchParams({ page: url })
    const res = await fetch(`/api/getId?${params.toString()}`)
    const data = await res.json()

    console.log(data)
    const { id, type } = data
    console.log(id)

    return data
  }

  $: promise = update(url)

  let copied = false

  $: if (copied) {
    setTimeout(() => {
      copied = false
    }, 2000)
  }
</script>

{#await promise}
  <div
    class="h-20 w-20 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"
  />
{:then { id, type }}
  <!-- Your community id is -->
  {#if id}
    <div class="flex flex-col items-center">
      <div class="text-2xl">Your {type}'s id is</div>
      <div class="text-4xl font-bold">
        {id}
        <!-- Copy id button -->
        <button
          class="relative bg-black p-2 text-2xl text-white hover:bg-gray-700"
          on:click={() => {
            navigator.clipboard.writeText(id)
            copied = true
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <!--Show popup that says copied  -->
      </div>

      {#if type === 'community'}
        <h2 class="text-2xl font-bold">
          To use with <a
            href="https://github.com/tefkah/pubpub-client"
            target="_blank">pubpub-client</a
          > add this to your project:
        </h2>
        <pre>
        {`import {PubPub} from 'pubpub-client'
        
        const pubpub = new PubPub('${id}',
                                  '${url}')`}
      </pre>
      {/if}
    </div>
  {:else}
    <div class="text-2xl font-bold text-red-500">No community found</div>
  {/if}
{:catch error}
  <div class="text-red-500">{error.message}</div>
{/await}
