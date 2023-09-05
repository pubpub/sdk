export const getFirebaseChild = (path: string, ...childPaths: string[]) =>
  `${path.replace(/\.json$/, '')}${
    childPaths.length === 0 ? '' : '/'
  }${childPaths.join('/')}.json`

export const writeFirebase = async (
  path: string,
  token: string,
  data: Record<string, any>
) => {
  const url = `${getFirebaseChild(path)}?auth=${token}`
  console.log('writeFirebase', url, data)
  const res = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(url, res)
    throw new Error('Error writing to firebase' + text)
  }

  return await res.json()
}
