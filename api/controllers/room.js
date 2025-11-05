import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import createError from "../utils/error.js";
import express from "express";


// CREATE ROOM
export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();

    // Add room reference to the hotel
    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { rooms: savedRoom._id }
    });

    res.status(201).json(savedRoom);
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
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

// ✅ UPDATE ROOM AVAILABILITY
export const updateRoomAvailability = async (req, res, next) => {
  try {
    const updatedRoom = await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": { $each: req.body.dates }
        }
      }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

// DELETE ROOM
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  try {
    await Room.findByIdAndDelete(req.params.id);
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
