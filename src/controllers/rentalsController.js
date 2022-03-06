import dayjs from 'dayjs'
import db from '../db.js'

export async function getRentals(req, res){

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

}

export async function deleteRental(req, res){
   
}