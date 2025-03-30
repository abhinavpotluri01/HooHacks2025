import express from "express";
const router = express.Router()

import {shoeGet, shoePost} from "../controllers/shoe.controller.js"

router.get('/', shoeGet)

router.post('/', shoePost)


export default router