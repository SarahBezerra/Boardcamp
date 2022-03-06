import { Router } from 'express'
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js'
import rentalSchema from '../schemas/rentalSchema.js'
import { createRental, deleteRental, finalizeRental, getRentals } from '../controllers/rentalsController.js'

const rentalsRouter = Router();

//rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', validateSchemaMiddleware(rentalSchema), createRental);
//rentalsRouter.post('/rentals/:id/return', finalizeRental);
//rentalsRouter.delete('/rentals/:id', deleteRental);

export default rentalsRouter;