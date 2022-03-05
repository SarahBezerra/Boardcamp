import { Router } from 'express'
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js'
import categorySchema from '../schemas/categorySchema.js'
import { getCategories, createCategory } from '../controllers/categoriesController.js'

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories', validateSchemaMiddleware(categorySchema), createCategory);

export default categoriesRouter;