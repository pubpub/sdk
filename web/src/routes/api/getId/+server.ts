import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({url}) =>{

const page=  url.searchParams.get('page')
if(!page){
  return new Response(JSON.stringify({error:"no page"}), {
    status: 400,
    headers: {
      "content-type": "application/json",
    },
  })
}

    const html = await fetch(page).then((res) => res.text())
    console.log(html)

    const unparsedCommunityData = html.match(
      new RegExp(
        `<script id="initial-data" type="text\\/plain" data-json="(.*?)"`
      )
    )

    if (!unparsedCommunityData) {
      throw new Error(`Could not find initial-data `)
    }

    const initialData = JSON.parse(
      unparsedCommunityData[1].replace(/&quot;/g, '"')
    )


    const {communityId, pubId, collectionId  } = initialData.scopeData.scope

    // we on the main page
    if(!pubId && !collectionId){
      return new Response(JSON.stringify({id:initialData.communityData.id, "type": "community"}), {
        headers: {
          "content-type": "application/json",
        },
      })
    }


    if(pubId){
      return new Response(JSON.stringify({id:pubId, "type": "pub"}), {
        headers: {
          "content-type": "application/json",
        },
      })
    }

    if(collectionId){
      return new Response(JSON.stringify({id:collectionId, "type": "collection"}), {
        headers: {
          "content-type": "application/json",
        },
      })
    }

    return new Response(JSON.stringify({error:"no id"}), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    })

    // console.log(communityData)

    const communtiyId = initialData.communityData.id


    return new Response(JSON.stringify({communtiyId}), {
      headers: {
        "content-type": "application/json",
      },
    })


}