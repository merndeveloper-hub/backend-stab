


import firebaseConfig from "../../../../config/firebase/firebaseConfig.js";

const getChatMessages = async (req, res) => {
  try {
    const { clientId, proId, limit = 30, lastVisibleTimestamp } = req.params;


    if (!clientId || !proId) {
      return res.status(400).json({ error: "clientId and proId are required." });
    }

    const chatId = `${proId}_${clientId}`;
   
    
    firebaseConfig.db
          .collection("chats")
          .doc(chatId)
          .collection("messages")
        .orderBy("createdAt") // Order messages by timestamp
          .onSnapshot((messagesSnapshot) => {
            console.log(messagesSnapshot, "messagesSnapshot");
    
            // if (messagesSnapshot.empty) {
            //   return res
            //     .status(404)
            //     .json({ success: false, message: "No messages found" });
            // }
    
            // Fetch all messages from the snapshot
            const messages = messagesSnapshot.docs.map((doc) => doc.data()); // Get all messages
    
            return  res.status(200).json({ success: true, messages });
            
    
          })
          
  
  } catch (error) {
    console.error("Get Chat Messages Error:", error);
    return res.status(400).json({ error: error.message }); 
  }
};

export default getChatMessages;
