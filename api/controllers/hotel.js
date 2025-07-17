import Hotel from "../models/Hotel.js";

// CREATE
export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(201).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

// UPDATE
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

// DELETE
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Hotel has been deleted." });
  } catch (err) {
    next(err);
  }
};

// GET ONE HOTEL
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

// GET ALL HOTELS
export const getallHotel = async (req, res, next) => {
  try {
    const allHotels = await Hotel.find();
    res.status(200).json(allHotels);
  } catch (err) {
    next(err);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",")
  try {
    const list = await Promise.all(cities.map(city=>{
      return Hotel.countDocuments({city:city})
    }))
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {

  try {
    const hotelCount =await Hotel.countDocuments({type: "Hotel"})
  const apartmentCount =await Hotel.countDocuments({type: "apartment"});
  const resortCount =await Hotel.countDocuments({type: "resort"});
  const villaCount = await Hotel.countDocuments({type: "villa"});
   const cabinCount =await Hotel.countDocuments({type: "cabin"});

    res.status(200).json([
    {type :"Hotel",count: hotelCount},
    {type :"apartment",count: apartmentCount},
    {type :"resort",count: resortCount},
    {type :"villa",count: villaCount},
    {type :"cabin",count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};