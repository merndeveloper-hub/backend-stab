// import Joi from "joi";
// import firebaseConfig from "../../../../config/firebase/firebaseConfig.js";

// console.log(firebaseConfig.db, "db");

// const schemaBody = Joi.object().keys({
//   clientId:Joi.string().required(),
//   proId: Joi.string().required(),
//   text: Joi.string().required(),
//   localTime:Joi.string().allow('').optional()
// });
 
// const chat = async (req, res) => {
 
//   await schemaBody.validateAsync(req.body);
//   const { clientId, proId, text, localTime } = req.body;

//   try {
//     const payload = { clientId, proId, text, localTime, timestamp: new Date() };
//     const chatId =
//       clientId < proId ? `${clientId}_${proId}` : `${proId}_${clientId}`;

//     // Create a new message in the appropriate chat document
//     await firebaseConfig.db
//       .collection("chats")
//       .doc(chatId) // Use consistent chat ID
//       .collection("messages")
//       .doc() // Let Firebase generate a random message ID
//       .set(payload);
//     return res
//       .status(200)
//       .json({ success: true, message: "Message sent successfully!" });
//   } catch (error) {
//     console.error("Send Message Error:", error);
//     res.status(400).json({ error: "Failed to send message." });
//   }
// };

// export default chat;

import Joi from "joi";
import firebaseConfig from "../../../../config/firebase/firebaseConfig.js"; // contains db, admin
//import { Timestamp } from "firebase-admin/firestore";
//import { FieldValue } from "firebase-admin/firestore";

// Optional: FCM Notification sender (add when ready)
// import { sendPushNotification } from "../../../../utils/fcm.js";

const schemaBody = Joi.object().keys({
  clientId: Joi.string().required(),
  proId: Joi.string().required(),
  text: Joi.string().allow("").optional(),
  localTime: Joi.string().allow("").optional(),
  mediaUrl: Joi.string().allow("").optional(),
  mediaType: Joi.string().valid("image", "audio", "video", "file").optional(),
});

const chat = async (req, res) => {
  
  try {
    await schemaBody.validateAsync(req.body);
    const { clientId, proId, text, localTime, mediaUrl, mediaType } = req.body;
    const senderId = clientId; // assuming client is the sender
   // const receiverId = proId;
    const chatId = clientId < proId ? `${clientId}_${proId}` : `${proId}_${clientId}`;

    const message = {
      senderId,
      senderRole:"pro",
      text: text || "",
      mediaUrl: mediaUrl || null,
      mediaType: mediaType || null,
      localTime: localTime || null,
    createdAt:new Date(),
     // timestamp: FieldValue.serverTimestamp(),
      readBy: [senderId], // sender has read their own message
    };

    const db = firebaseConfig.db;

    // Add message to chat's messages subcollection
    await db.collection("chats")
      .doc(chatId)
      .collection("messages")
      .add(message);

    // Update chat metadata
    await db.collection("chats")
      .doc(chatId)
      .set({
        participants: [clientId, proId],
        lastMessage: text || mediaType || "media",
     //  updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });

    // Optional: Push Notification Logic (Add if you need)
    // const receiver = await db.collection("users").doc(receiverId).get();
    // const fcmToken = receiver.data()?.fcmToken;
    // if (fcmToken) {
    //   await sendPushNotification(fcmToken, "New message", text || "📎 Media", {
    //     chatId,
    //     senderId
    //   });
    // }

    return res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Send Message Error:", error);
   return res.status(400).json({ error: error.message }); 
  }
};

export default chat;
