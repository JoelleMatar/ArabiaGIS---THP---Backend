import express from "express";
const router = express.Router();

import {
    signup,
    signin,
    getUsers,
    importData,
} from "../controllers/user.js";

import {
    deleteAllData,
    getAccidents,
    deleteAccidentRow,
    updateAccidentRow,
    getAccident
} from "../controllers/data.js";

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/users", getUsers);

router.post("/import", importData);
router.delete("/delete", deleteAllData);
router.get("/accidents", getAccidents);
router.delete("/delete/:id", deleteAccidentRow);
router.patch("/update/:id", updateAccidentRow);
router.get("/accident/:id", getAccident);

export default router;