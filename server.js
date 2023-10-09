const express=require('express');
const bodyParser=require('body-parser');
const {  room, booking } = require("./data.js");
require('dotenv').config()

const app=express();
app.use(bodyParser.json());
const PORT=process.env.PORT

app.get("/",(req,res)=>{
    res.status(201).send(`hall booking server working fine`);


});


//1.api for room creation
app.post("/createroom",(req,res)=>{
const newroom=req.body;
if( !newroom.roomName || ! newroom.seats ||!newroom. amenities ||!newroom.pricePerHour){
    return res.status(400).send("please roomName,seats,amenities,pricePerHour");
}
newroom.roomId=room.length+1;
room.push(newroom);
res.status(201).send(`room created successfully`);
});


//2.api for booking room
app.post("/bookroom",(req,res)=>{
    const book_room={
           roomId:req.body.roomId,
           customerName:req.body.customerName,
           date:new Date(req.body.date).toLocaleDateString(),
           startTime:req.body.startTime.toFixed(2),
           endTime:req.body.endTime.toFixed(2)

    };

if(!book_room.roomId||!book_room.customerName ||!book_room.date
     ||!book_room.startTime ||!book_room.endTime){
    return res.status(400).send(`please enter roomId,
    customerName,date(yyyy-mm-dd),startTime,Endtime in 24hrs format
    
    `);
}
else {
 //checking room avilablity

const availablity=booking.filter((e)=>e.roomId==book_room.roomId).every((e)=>e?.date!==book_room.date ||(e.startTime>book_room.startTime &&e.endTime>book_room.endTime) ||(e.endTime<book_room.startTime ))

 if(room.findIndex(e=>e.id==book_room.roomId)!==-1 && availablity){
    book_room.id=booking.length+1;
    booking.push(book_room); 
    return res.status(201).json("room booked sucessfully");
 }else{
    return res.status(400).send('slot not avilable')
 }

}

});

//3.list all room with booked data
app.get("/allrooms",(req,res)=>{
    const roomBookings = room.map(room => {
        const bookingsForRoom = booking.filter(booking => booking.roomId === room.id);
        const bookedStatus = bookingsForRoom.length > 0 ? 'Booked' : 'Available'; 
        return {
          roomName: room.roomName,
          bookedStatus,
          bookings: bookingsForRoom
        };
      });
    
      res.status(200).json(roomBookings);
    
})



//4.list the all customer with booked data

app.get("/allcustomers",(req,res)=>{

    const customerBookings = booking.map(booking => {
        const rooms = room.find(room => room.id === booking.roomId);
    
        return {
          customerName: booking.customerName,
          roomName: rooms.roomName,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime
        };
      });
    
      res.status(200).json(customerBookings);

});

//5.list how many times customer has booked the room with
//  following details

app.get("/bookingcount/:customerName",(req,res)=>{
 
    const { customerName } = req.params;

  const customerBookings = booking.filter(booking => booking.customerName === customerName);

  res.status(200).json({ 
    customerName:customerName,
    bookingCount: customerBookings.length,
    bookings: customerBookings
  });
    
 
});




app.listen(PORT,()=>{
    console.log(`The server running on port ${PORT}`);
    
    
    
})


