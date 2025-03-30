import express from "express";
const router = express.Router()

import {jobGet, jobPost, jobUpdate, jobDelete} from "../controllers/shoe.controller.js"

router.get('/', jobGet)

router.post('/', jobPost)

router.put('/:id', jobUpdate)

router.delete('/:id', jobDelete)

export default router