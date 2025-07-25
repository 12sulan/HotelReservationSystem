import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import createError from "../utils/error.js";

// CREATE ROOM
export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  console.log(hotelId)
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();

    // Add the room id to the corresponding hotel
    const hotel = await Hotel.findByIdAndUpdate(hotelId, {
      $push: { rooms: savedRoom._id },
    });
    console.log(hotel);

    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

// UPDATE ROOM
export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);  // fixed typo: was updateRoom
  } catch (err) {
    next(err);
  }
};

// DELETE ROOM
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  try {
    // Delete the room
    await Room.findByIdAndDelete(req.params.id);

    // Remove the room from the hotel's rooms array
    await Hotel.findByIdAndUpdate(hotelId, {
      $pull: { rooms: req.params.id },
    });

    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};

// GET SINGLE ROOM
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

// GET ALL ROOMS
export const getallRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};
