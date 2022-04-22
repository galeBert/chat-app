import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCl0eTUbnDS4-kFW9-Xwb3Ih8KVuWRYeI4',
  authDomain: 'insvire-curious-app.firebaseapp.com',
  databaseURL:
    'https://insvire-curious-app-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'insvire-curious-app',
  storageBucket: 'insvire-curious-app.appspot.com',
  messagingSenderId: '32784977098',
  appId: '1:32784977098:web:66ff9a0b1a3d4c00457833',
  measurementId: 'G-6VPVBYFZZW',
}

initializeApp(firebaseConfig)

export const db = getFirestore()
export const storage = getStorage(initializeApp(firebaseConfig))
export const auth = getAuth()

export const googleAuthProvider = new GoogleAuthProvider()
export const facebookAuthProvider = new FacebookAuthProvider()
export const twitterAuthProvider = new TwitterAuthProvider()
