import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import { firebaseConfig } from './firebaseConfig'

export const initFirebase = async (
  rootKey: string,
  authToken: string,
  existingApp?: firebase.app.App
) => {
  const firebaseAppName = `App-${rootKey}`
  /* Use the existing Firebase App or initialize a new one */
  const firebaseApp =
    existingApp || firebase.initializeApp(firebaseConfig, firebaseAppName)

  const database = firebase.database(firebaseApp)

  /* Authenticate with the server-generated token */
  try {
    const auth = await firebase.auth(firebaseApp)
    await auth.signOut()
    await auth.signInWithCustomToken(authToken)
    return database.ref(rootKey)
  } catch (err) {
    console.error('Error authenticating firebase', err)
    return null
  }
}
