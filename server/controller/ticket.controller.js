import asyncHandler from 'express-async-handler'
import Ticket from '../models/Ticket.model.js'

// Create controller : Create new ticket
// route: POST api/tickets
export const createTicket= asyncHandler(async (req,res) => {
    const {issue_type,title,description}= req.body;
    
    //checking if all required fields  exists
    if (!issue_type||!title||!description) {
        res.status(400);
        throw new Error('please fill all required fields');
    }
    //creating ticket 
    const ticket= await Ticket.create({
        issue_type,
        title,
        description,
        user:req.user._id,
        status:'new',//Defualt statue for new tickets
    });
    // send the ticket back 
    res.status(201).json(ticket);
});

//  Read controller : Get all User Tickets
// route: GET api/tickets
export const getTickets= asyncHandler(async (req,res) => {

    //fetch tickets from DataBase and check user role 
    // Admin can see all tickets
    let tickets;
    if (req.user.role === 'admin') {
         tickets= await Ticket.find({}).populate('user','fullName email') ///get all tickets including user info 
    }
    else {
        //find tickets where user match the same Id
        tickets= await Ticket.find({
            user:req.user.id
        })
    }
   
    //send the array of tickets back to the client
    res.status(200).json(tickets);
});

// Read One controller: Get one ticket
// route: GET /api/tickets/:id
export const getTicket= asyncHandler(async (req,res) => {
    
    const ticket= await Ticket.findById(req.params.id);

    // check if the ticket exists
    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    // must be the ticket owner OR an Admin
    if (ticket.user.toString() !== req.user.id && req.user.role !=="admin") {
        res.status(401);
        throw new Error('Not Authorized to view this ticket');
    }

    // return the ticket to user
    res.status(200).json(ticket);

})

// Delete controller: delete Ticket
// route: DELETE /api/tickets/:id

export const deleteTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    // must be the ticket owner OR an Admin
    if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not Authorized to delete this ticket');
    }

    await ticket.deleteOne();

    res.status(200).json({ message: 'Ticket deleted' });
});