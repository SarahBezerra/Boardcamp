import dayjs from 'dayjs'
import db from '../db.js'

export async function getRentals(req, res){
    const { customerId } = req.query;
    const { gameId } = req.query;
    let query = "";

    customerId ? query = ` WHERE rentals."customerId"=${customerId}` : ""
    gameId ? query = ` WHERE rentals."gameId"=${gameId}` : ""

    try{
        const rentals = await db.query(`
            SELECT 
                rentals.*, 
                customers.id as "customer_id", customers.name as "customer_name", 
                games.id as "game_id", games.name as "game_name", games."categoryId" as "game_category", 
                categories.name AS "categoryName"
            FROM rentals
                JOIN customers ON customers.id=rentals."customerId" 
                JOIN games ON games.id=rentals."gameId"
                JOIN categories ON categories.id="categoryId"
            ${query}
        `);

        const rentalsInfos = rentals.rows.map(rental => {
            return {
                id: rental.id,
                customerId: rental.customerId,
                gameId: rental.gameId,
                rentDate: rental.rentDate,
                daysRented: rental.daysRented,
                returnDate: rental.returnDate,
                originalPrice: rental.originalPrice,
                delayFee: rental.delayFee,
                customer: {
                    id: rental.customer_id,
                    name: rental.customer_name
                },
                game: {
                    id: rental.game_id,
                    name: rental.game_name,
                    categoryId: rental.game_category,
                    categoryName: rental.categoryName
                }
            }
        })

        res.send(rentalsInfos)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }

}

export async function createRental(req, res){
    const rental = req.body;

    try{
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1`
        , [rental.customerId]);
        if(!customer.rowCount){
            return res.status(400).send("Cliente não encontrado");
        }
        
        const game = await db.query(`SELECT * FROM games WHERE id=$1`
        , [rental.gameId]);
        if(!game.rowCount){
            return res.status(400).send("Jogo não encontrado");
        }

        const rentedGames = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1`
        , [rental.gameId]);

        if(game.rows[0].stockTotal === rentedGames.rowCount){
            return res.status(400).send("Jogo esgotado");
        }

        const rentalFormat = {
            ...rental,
            rentDate: dayjs().format('YYYY-MM-DD'),
            returnDate: null,
            originalPrice:  rental.daysRented * game.rows[0].pricePerDay,
            delayFee: null  
        }

        const { customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee } = rentalFormat;
        
        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`
        , [ customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee ]);

        res.sendStatus(201);

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export async function finalizeRental(req, res){
    const { id }  = req.params;

    try{
        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`
        , [id]);
        if(!rental.rowCount){
            return res.sendStatus(404);
        }

        if(rental.rows[0].returnDate !== null){
            return res.sendStatus(400);
        }

        const diff = Math.abs(new Date().getTime() - rental.rows[0].rentDate.getTime());
        const totalDaysElapsed = Math.ceil(diff / (1000 * 60 * 60 * 24));

        const today = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        let delayFee = "";
        if(totalDaysElapsed - rental.rows[0].daysRented > 0 ){
            const daysOfDelay = totalDaysElapsed - rental.rows[0].daysRented;

            const pricePerGameDay = await db.query(`
                SELECT games."pricePerDay" 
                    FROM games 
                WHERE id=${rental.rows[0].gameId}`);

            delayFee = daysOfDelay * pricePerGameDay.rows[0].pricePerDay;

            await db.query(`
                UPDATE rentals 
                    SET "returnDate"='${today}', "delayFee"='${delayFee}' 
                WHERE id=${id}
            `);
        }

        await db.query(`
            UPDATE rentals 
                SET "returnDate"='${today}' 
            WHERE id=${id}
        `);

        res.sendStatus(200);

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export async function deleteRental(req, res){
    const { id } = req.params;

    try{
        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`
        , [id]);
        if(!rental.rowCount){
            return res.sendStatus(404);
        }

        if(rental.returnDate){
            return res.sendStatus(400);
        }

        db.query(`DELETE FROM rentals WHERE id=$1`
        , [id])
        res.sendStatus(200);

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}