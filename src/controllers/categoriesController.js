import db from '../db.js'

export async function getCategories(req, res){

    try{
        const categories = await db.query(`SELECT * FROM categories`);
        res.send(categories.rows);

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export async function createCategory(req, res){
    const { name } = req.body;

    try{
        const categoryExists = await db.query(`SELECT * FROM categories WHERE name=$1`
        , [name]);
        if(categoryExists.rowCount){
            return res.sendStatus(409);
        }

        await db.query(`INSERT INTO categories (name) VALUES ($1)`
        , [name]);

        res.sendStatus(201);

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}