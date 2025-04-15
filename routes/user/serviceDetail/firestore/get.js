
import firebaseConfig from "../../../../config/firebase/firebaseConfig.js";

const getChatMessages = async (req, res) => {
  try {
    const { clientId, proId, limit = 30, lastVisibleTimestamp } = req.params;

    if (!clientId || !proId) {
      return res.status(400).json({ error: "clientId and proId are required." });
    }

    const chatId = `${proId}_${clientId}`;

    let queryRef = firebaseConfig.db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt", "desc")
    //  .limit(Number(limit));

    // if (lastVisibleTimestamp) {
    //   const parsedTimestamp = new Date(lastVisibleTimestamp);
    //   queryRef = queryRef.startAfter(parsedTimestamp);
    // }

    const snapshot = await queryRef.get();

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({
      success: true,
      messages,
   //   lastVisible: messages.length > 0 ? messages[messages.length - 1].createdAt : null
    });

  } catch (error) {
    console.error("Get Chat Messages Error:", error);
    return res.status(400).json({ error: error.message });
  }
};

export default getChatMessages;
