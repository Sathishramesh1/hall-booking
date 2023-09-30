const express=require('express');
const bodyParser=require('body-parser');
require('dotenv').config()

const app=express();
app.use(bodyParser.json());
const PORT=process.env.PORT

app.get("/",(req,res)=>{
    res.status(201).json(room);


});

const room=[];
const booking=[]

//api for room creation
app.post("/createroom",(req,res)=>{
const newroom=req.body;
if(!newroom.id || !newroom.available_seats || ! newroom.price_perhour){
    return res.status(400).send("please enter id,avialble_seats,price");
}
room.push(newroom);
res.status(201).send(`room created successfully`);
})


//api for booking room
app.post("/bookroom",(req,res)=>{
    const book_room=req.body;

if(!book_room.id||!book_room.customer_name ||!book_room.date ){
    return res.status(400).send("please enter details");
}else {
const  booking_condtion=room.some((e)=>e.id==book_room.id)
 const overlap_booking=booking.every((e)=>e?.id !== book_room.id);

if(booking_condtion&&overlap_booking){
    booking.push(book_room);
    return res.status(201).send("room booked");
}else{
    return res.status(400).send("room already booked");
} 

}

});

//list all room with booked data
app.get("/allrooms",(req,res)=>{
    return res.status(201).json(booking.map((e)=>e))
})

app.listen(PORT,()=>{
    console.log(`The server running on port ${PORT}`)
})


