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
