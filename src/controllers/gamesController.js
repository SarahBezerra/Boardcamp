import db from '../db.js'

export async function getGames(req, res){
    const queryName = req.query.name;

    try{
        const games = await db.query(`
            SELECT g.*, c.name AS "categoryName" 
                FROM games AS g JOIN categories AS c
                    ON g."categoryId"=c.id
        `);

        if(!queryName){
            return res.send(games.rows);
        }

        const regex = new RegExp(`\^${queryName.toUpperCase()}`);
        const filterGames = games.rows.filter(game => {
            return regex.test(game.name.toUpperCase())
        })

        res.send(filterGames)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export async function createGame(req, res){
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try{
        const categoryExists = await db.query(`SELECT * FROM categories WHERE id=$1`
        , [categoryId]);
        if(!categoryExists.rowCount){
            return res.sendStatus(400);
        }

        const nameExists = await db.query(`SELECT * FROM games WHERE name=$1`
        , [name]);
        if(nameExists.rowCount){
            return res.sendStatus(409);
        }

        await db.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
                        VALUES ($1, $2, $3, $4, $5)`
        , [ name, image, stockTotal, categoryId, pricePerDay ]);

        res.sendStatus(201);

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}