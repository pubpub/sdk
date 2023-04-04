import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, signInWithCustomToken, signOut } from 'firebase/auth'

import { getDatabase, ref } from 'firebase/database'

import { firebaseConfig } from './firebaseConfig'

export const initFirebase = async (
  rootKey: string,
  authToken: string,
  existingApp?: FirebaseApp
) => {
  const firebaseAppName = `App-${rootKey}`
  /* Use the existing Firebase App or initialize a new one */
  const firebaseApp =
    existingApp || initializeApp(firebaseConfig, firebaseAppName)

  const database = getDatabase(firebaseApp)

  /* Authenticate with the server-generated token */
  try {
    const auth = await getAuth(firebaseApp)
    await signOut(auth)
    await signInWithCustomToken(auth, authToken)
    return ref(database, rootKey)
  } catch (err) {
    console.error('Error authenticating firebase', err)
    return null
  }
}
