import { Router } from 'express'
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js'
import gameSchema from '../schemas/gameSchema.js'
import { createGame, getGames } from '../controllers/gamesController.js'

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', validateSchemaMiddleware(gameSchema), createGame);

export default gamesRouter;