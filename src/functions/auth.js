import { auth, db, googleAuthProvider } from '../utils/firebase';

import {
  getAuth,
  getIdToken,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

export const getCollection = async (data, doc, value) => {
  const getCollections = query(collection(db, data), where(doc, '==', value));

  return getDocs(getCollections);
};

export const observeSnapshot = async (
  data,
  doc,
  value,
  onReceived,
  onError
) => {
  const getAuthData = getAuth();
  await onAuthStateChanged(getAuthData, async (user) => {
    console.log('user', user);
    if (user) {
      const userInfo = await getCollection('admin', 'email', user.email);
      const parseUserInfo = await userInfo.docs.map((datas) => datas.data());

      if (parseUserInfo[0]?.level < 3) {
        await onSnapshot(
          query(collection(db, data), where(doc, '==', value)),
          { includeMetadataChanges: true },
          (docs) => {
            const list = [];
            docs.forEach(async (notif) => {
              list.push({
                id: notif.id,
                ...notif.data(),
              });
            });

            onReceived(list);
          },
          (err) => {
            onError(err);
          }
        );
      }
      // ...
    } else {
      onReceived([]);
      // User is signed out
      // ...
    }
  });
};

export const handleAuth = (check, setToken, accessCodeAccount) => {
  return signInWithPopup(auth, googleAuthProvider).then(async (result) => {
    console.log('result: ', result);
    const token = result.user.accessToken;
    const email = result.user.email;
    setToken(token);
    check({
      variables: { email, accessCode: accessCodeAccount, uid: result.user.uid },
    });
  });

  // .catch((error) => {
  //   // modal.actions.setIsLoadingScreen(true)
  //   // Handle Errors here.
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // The email of the user's account used.
  //   const email = error.email;
  //   // The AuthCredential type that was used.
  //   // const credential = GoogleAuthProvider.credentialFromError(error);
  //   // ...
  //   console.log(errorCode, errorMessage, email);
  // });
};
export const handleLogout = () => {
  signOut(auth)
    .then((data) => console.log('keluar', data))
    .catch((err) => console.log(err));
};

export const onRefreshToken = () => {
  getIdToken(auth.currentUser, true)
    .then((newToken) => {
      localStorage.setItem('token', newToken);

      window.location.reload();
    })
    .catch((err) => {
      console.error(err);
    });
};
