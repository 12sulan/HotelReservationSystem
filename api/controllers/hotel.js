import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

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
    const { city, type, min, max, featured, limit } = req.query;

    const query = {
      ...(type && { type }),
      ...(featured !== undefined && { featured: featured === 'true' }),
    };


    if (city) {
      query.city = { $regex: new RegExp(city, 'i') };
    }

    const priceFilter = {};
    if (!isNaN(parseInt(min))) priceFilter.$gte = parseInt(min);
    if (!isNaN(parseInt(max))) priceFilter.$lte = parseInt(max);
    if (Object.keys(priceFilter).length) query.CheapestPrice = priceFilter;

    const allHotels = await Hotel.find(query).limit(parseInt(limit) || 0);

    res.status(200).json(allHotels);
  } catch (err) {
    next(err);
  }
};


export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",")
  try {
    const list = await Promise.all(cities.map(city => {
      return Hotel.countDocuments({ city: city })
    }))
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};


export const countByType = async (req, res, next) => {
  try {
    const typeCounts = await Hotel.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(typeCounts)

    const counts = {
      Hotel: 0,
      Apartment: 0,
      Resort: 0,
      Villa: 0,
      Cabin: 0,
    };

    typeCounts.forEach((item) => {
      counts[item._id] = item.count;
    });
    console.log(counts);

    res.status(200).json([
      { type: "Hotel", count: counts.Hotel },
      { type: "Apartment", count: counts.Apartment },
      { type: "Resort", count: counts.Resort },
      { type: "Villa", count: counts.Villa },
      { type: "Cabin", count: counts.Cabin },
    ]);
  } catch (err) {
    next(err);
  }
};


export const getHotelRooms = async (req, res, next) => {
  try {
    const params = req.params;
    const hotel = await Hotel.findById(params.id);

    if(!hotel.rooms){
       res.status(200).json({"msg":"err"});
       return;
    }
    const list = await Promise.all(hotel.rooms.map(room => {
      return Room.findById(room);
    }))

    res.status(200).json(list)
  } catch (err) {
    next(err)
  }
};
