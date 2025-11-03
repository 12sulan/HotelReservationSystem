import express from "express";
import {verifyAdmin } from  "../utils/verifyToken.js";
import {
      countByCity,
      countByType,
     createHotel,
     deleteHotel,
      getallHotel, 
      getHotel, 
      getHotelRooms, 
      updateHotel  } from "../controllers/hotel.js";

import Hotel from "../models/Hotel.js";

const router = express.Router();

//CREATE
router.post("/",verifyAdmin, createHotel);

//UPDATE
router.put("/:id",verifyAdmin, updateHotel);
// DELETE
router.delete("/:id",verifyAdmin, deleteHotel);
//GET
router.get("/find/:id", getHotel);

//GET ALL
router.get("/", getallHotel);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id",getHotelRooms);

export default router ;  