const admin = require("firebase-admin")

const serviceAccount= require("./serviceAccountKey.json")

function initializeFirebase(){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
    return admin.firestore()
}

const db=initializeFirebase()

module.exports=db