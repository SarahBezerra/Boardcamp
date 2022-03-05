import { Router } from 'express'
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js'
import customersSchema from '../schemas/customersSchema.js'
import { createCustomer, getCustomers, updateCustomer } from '../controllers/customersController.js'

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.post('/customers', validateSchemaMiddleware(customersSchema), createCustomer);
customersRouter.put('/customers', validateSchemaMiddleware(customersSchema), updateCustomer);

export default customersRouter;