import { Router } from 'express'
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js'
import customersSchema from '../schemas/customersSchema.js'
import { createCustomer, getCustomer, getCustomers, updateCustomer } from '../controllers/customersController.js'

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomer);
customersRouter.post('/customers', validateSchemaMiddleware(customersSchema), createCustomer);
customersRouter.put('/customers/:id', validateSchemaMiddleware(customersSchema), updateCustomer);

export default customersRouter;