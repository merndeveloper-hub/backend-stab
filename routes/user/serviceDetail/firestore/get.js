// import Joi from "joi";
// import firebaseConfig from "../../../../config/firebase/firebaseConfig.js";

// const schemaBody = Joi.object().keys({
//   clientId:Joi.string().required(),
//   proId: Joi.string().required(),

// });

// const getChat = async (req, res) => {
//   console.log(req.params, "params");
//   await schemaBody.validateAsync(req.params);
//   const { clientId, proId } = req.params;

//   const chatId =
//     clientId < proId ? `${clientId}_${proId}` : `${proId}_${clientId}`;
//   console.log(chatId, "chatid");

//   try {
//     // Using onSnapshot for real-time updates
//     firebaseConfig.db
//       .collection("chats")
//       .doc(chatId)
//       .collection("messages")
//       .orderBy("timestamp") // Order messages by timestamp
//       .onSnapshot((messagesSnapshot) => {
//         console.log(messagesSnapshot, "messagesSnapshot");

//         if (messagesSnapshot.empty) {
//           return res
//             .status(404)
//             .json({ success: false, message: "No messages found" });
//         }

//         // Fetch all messages from the snapshot
//         const messages = messagesSnapshot.docs.map((doc) => doc.data()); // Get all messages

//         console.log(messages, "all messages");

//       return  res.status(200).json({ success: true, messages });
//       });
//   } catch (error) {
//     console.error("Error fetching message:", error);
//     res
//       .status(400)
//       .json({ success: false, message: "Failed to fetch message" });
//   }
// };

// export default getChat;

import firebaseConfig from "../../../../config/firebase/firebaseConfig.js";

const getChatMessages = async (req, res) => {
  try {
    const { clientId, proId, limit = 30, lastVisibleTimestamp } = req.params;
   

    if (!clientId || !proId) {
      return res
        .status(400)
        .json({ error: "clientId and proId are required." });
    }

    const chatId =
      clientId < proId ? `${clientId}_${proId}` : `${proId}_${clientId}`;
  

    firebaseConfig.db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
        .orderBy("createdAt") // Order messages by timestamp
      .onSnapshot((messagesSnapshot) => {
        console.log(messagesSnapshot, "messagesSnapshot");

        if (messagesSnapshot.empty) {
          return res
            .status(404)
            .json({ success: false, message: "No messages found" });
        }

        // Fetch all messages from the snapshot
        const messages = messagesSnapshot.docs.map((doc) => doc.data()); // Get all messages

        console.log(messages, "all messages");

        return res.status(200).json({ success: true, messages });
      });
    //  const db = firebaseConfig.db;

    // let queryRef = db
    //   .collection("chats")
    //   .doc("pro123_user123")
    //   .collection("messages")
    //   .orderBy("timestamp", "desc")
    // .limit(Number(limit));

    // if (lastVisibleTimestamp) {
    //   // Convert lastVisibleTimestamp to Firestore Timestamp if sent as string
    //   const parsedTimestamp = new Date(lastVisibleTimestamp);
    //   queryRef = queryRef.startAfter(parsedTimestamp);
    // }

    // const snapshot = await queryRef.get();

    // const messages = snapshot.docs.map(doc => ({
    //   id: doc.id,
    //   ...doc.data()
    // }));

    // return res.status(200).json({
    //   success: true,
    //   messages,
    //  // lastVisible: messages.length > 0 ? messages[messages.length - 1].timestamp : null
    // });
  } catch (error) {
    console.error("Get Chat Messages Error:", error);
    return res.status(500).json({ error: "Failed to fetch messages." });
  }
};

export default getChatMessages;
