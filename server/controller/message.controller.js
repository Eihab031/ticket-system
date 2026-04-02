import AsyncHandler from "express-async-handler";
import Ticket from "../models/Ticket.model.js";
import Message from "../models/Message.model.js";

/* 
send a Message on a Ticket
route : POST /api/tickets/:id/messages
*/
export const creatMessage= AsyncHandler(async (req,res) => {
    const {body}= req.body;

     //check if message not empty
     if (!body) {
        res.status(400);
        throw new Error("message can't be empty");
     }

     //finding the ticket
     const ticket= await Ticket.findById(req.params.id);

     // is ticket exist?
     if (!ticket) {
        res.status(404);
        throw new Error('ticket not found');
     }
     // only ticket owner or Admin
     if (req.user.id.toString() !== ticket.user.id && req.user.role !=="admin") {
        res.status(401);
        throw new Error("not Authorized to message on this ticket");
     }
     //check if the sender is admin 
     const isSenderAdmin= req.user.role ==="admin";
     // creating the message
     const message= await Message.create({
        ticket:req.params.id,
        sender:req.user.id,
        body,
        isAdmin:isSenderAdmin,
     });
     // populating sender info before sending back
     const populated= await message.populate('sender','fullName email role');

     res.status(201).json(populated);

});
/* 
Get all messages for a ticket
route: GET /api/tickets/:id/messages
*/
export const getMessages= AsyncHandler(async (req,res) => {
   const ticket= await Ticket.findById(req.params.id);

   //check if ticket exists
   if(!ticket){
      res.status(404);
      throw new Error("ticket not found");
   }

   //players can see their own messages,admin they have access also
   if(!req.user.id.toString() !==ticket.user.id &&req.user.role !=="admin"){
      res.status(401);
      throw new Error("not Authourized to view this content");
   }
   //finding messages
   const messages= await Message.find({ticket:req.params.id})
   .populate('sender','fullName email role') //getting user info
   .sort({createdAt:1});

   //return the messages to client
   res.status(200).json(messages);
});

/* 
Delete a message 
route : DELETE /api/ticket/:id/messages/:messageId
*/

export const deleteMessage= AsyncHandler(async (req,res) => {
   
   //find the ticket 
   const ticket = await Ticket.findById(req.params.id);
   
   // is ticket exists?
   if(!ticket){
      res.status(404);
      throw new Error('ticket not found');
   }
   // check if the client has authority
   if(req.user.id.toString()!== ticket.user.id && req.user.role !== "admin")
   {
   res.status(401);
   throw new Error("not Authorized to delete this message");
   }
   // find the message and check if it exists
   const message =await Message.findById(req.params.messageId);
   if(!message){
      res.status(404);
      throw new Error("message not found");
   }
   //delete the message from DataBase
   await message.deleteOne();
   
   //return successful message
   res.status(200).json({
        success:true,
        message:'message deleted successfully',
        data:message,
    });
})