import express from "express";


//----------Firebase-------------//

import chat from "./firestore/chat.js";
import getChat from "./firestore/get.js";

import cancelledBooking from "./bookedServiceCancel.js";
import completedBookedService from "./bookedServiceCompleted.js";



const router = express.Router();





///--------On going cancelbooking Remove get (created,requested,accepted services)------///
router.put("/:id", cancelledBooking);


///--------On going cancelbooking Remove get (created,requested,accepted services)------///
router.put("/completed/:id", completedBookedService);


//---------pro chat to user----------//
router.post("/chat", chat);

// get pro chat
router.get("/conversation/:clientId/:proId", getChat);

export default router;
