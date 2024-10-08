import { FireBaseQueryType } from "../../types/fireBaseQuery";
import { dbMap } from "./firebaseApp";

export async function addDoc(
  dbName: string,
  colName: string,
  docName: string | null,
  data: { [key: string]: any }
): Promise<boolean> {
  try {
    const db: FirebaseFirestore.Firestore = dbMap[dbName];
    const colRef = db.collection(colName);
    if (docName) {
      const docRef = colRef.doc(docName);
      await docRef.set(data).then(() => {
        console.log("Document created in :", colName, docName);
      });
    } else {
      // if docName is not given, auto-generate it
      await colRef.add(data).then((req) => {
        console.log("document created with docId", colName, req.id);
      });
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.log("addDoc error", error.message);
    }
    return false;
  }
}

// getDoc by DocName
export async function getDoc(
  dbName: string,
  colName: string,
  docName: string
): Promise<{ [key: string]: any } | undefined> {
  try {
    const db: FirebaseFirestore.Firestore = dbMap[dbName];
    const docRef = db.collection(colName).doc(docName);
    const doc = await docRef.get();
    console.log(doc.exists);
    if (doc.exists) return doc.data();
  } catch (error) {
    if (error instanceof Error) {
      console.log("getDoc error", error.message);
      return undefined;
    }
  }
}

export async function updateDoc(
  dbName: string,
  colName: string,
  docName: string,
  kvpair: { [key: string]: any }
): Promise<void> {
  const db: FirebaseFirestore.Firestore = dbMap[dbName];
  const docRef = db.collection(colName).doc(docName);
  await docRef
    .update(kvpair)
    .then(() => {
      console.log("updated");
    })
    .catch((error) => {
      throw error;
    });
}

export async function delDoc(
  dbName: string,
  colName: string,
  docName: string
): Promise<boolean> {
  const db: FirebaseFirestore.Firestore = dbMap[dbName];
  const docRef = db.collection(colName).doc(docName);
  const doc = await docRef.get();
  if (doc.exists) {
    await docRef.delete().then(() => {
      // console.log("deleted", docName);
    });
    return true;
  } else {
    // console.log("Document not found", docName);
    return false;
  }
}

export async function getDocByQuery(
  dbName: string,
  colName: string,
  fireBaseQuerys: FireBaseQueryType[]
): Promise<FirebaseFirestore.DocumentData[]> {
  const db: FirebaseFirestore.Firestore = dbMap[dbName];
  let colRef = db.collection(colName);
  let query: FirebaseFirestore.Query = colRef;
  for (const fireBaseQuery of fireBaseQuerys) {
    query = query.where(
      fireBaseQuery.field,
      fireBaseQuery.operator,
      fireBaseQuery.value
    );
  }
  const querySnapshot = await query.get();
  const data = querySnapshot.docs.map((doc) => doc.data());
  return data;
}

// function main() {
//   console.log("Testing documentOperation.ts");
//   addDoc(dbName.default,"users", "user1", { name: "user1", age: 20 });
//   getDoc("users", "user1").then((data) => {
//     console.log(data, typeof data);
//   });
//   delDoc("users", "user1");
//   // updateDoc("users", "user1", { age: 21 });
// }
// main();
