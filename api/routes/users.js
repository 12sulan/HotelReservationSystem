import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser
} from "../controllers/user.js";
import { verifyToken,verifyUser,verifyAdmin} from "../utils/verifyToken.js";

const router = express.Router();

router.get("/checkauthentication",verifyToken,(req,res,next)=>{
    res.send("Hello user, you are logged in");
})

router.use(verifyToken);

router.get("/checkuser/:id",verifyUser,(req,res,next)=>{
    res.send("Hello user, you are logged in and you can delete your account.");
})

router.get("/checkadmin/:id",verifyAdmin,(req,res,next)=>{
    res.send("Hello admin, you are logged in and you can delete all account.");
})

// UPDATE
router.put("/:id",verifyUser, updateUser);

// DELETE
router.delete("/:id", verifyUser, deleteUser);

// GET ONE
router.get("/:id",verifyUser, getUser);

// GET ALL
router.get("/",verifyAdmin, getAllUsers);


export default router;
