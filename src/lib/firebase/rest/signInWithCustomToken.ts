import { firebaseConfig } from '../firebaseConfig'

export interface FirebaseResponse {
  kind: string
  idToken: string
  refreshToken: string
  expiresIn: string
  isNewUser: boolean
}

export const signInWithCustomToken = async (token: string) => {
  const query = new URLSearchParams({
    key: firebaseConfig.apiKey,
  })
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?${query.toString()}`,
    {
      method: 'POST',
      body: JSON.stringify({
        token,
        returnSecureToken: true,
      }),
    }
  )

  if (!res.ok) {
    throw new Error('Error signing in with custom token')
  }

  const json = (await res.json()) as FirebaseResponse

  return json
}
