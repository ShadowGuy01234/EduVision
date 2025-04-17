import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../firebaseConfig.js';

const querySnapshot = await getDocs(collection(db, "test"));
querySnapshot.forEach((doc) => {
    // doc.forEach((subdoc) => {
    //     console.log(`${subdoc.id} => ${subdoc.data()}`);

    // })
    console.log(doc)
});