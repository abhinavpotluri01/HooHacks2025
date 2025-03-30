import express from "express";
const profileRouter = express.Router()

import {profileGet, profilePost, profileUpdate, profileDelete, profileIndividualGet} from "../controllers/profiles.controller.js"

profileRouter.get('/', profileGet)

profileRouter.post('/', profilePost)

profileRouter.put('/:id', profileUpdate)

profileRouter.delete('/:id', profileDelete)

profileRouter.get('/:username', profileIndividualGet )

export default profileRouter