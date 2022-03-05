import db from '../db.js'

export async function getCustomers(req, res){

    try{

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export async function createCustomer(req, res){
    const { name, phone, cpf, birthday } = req.body;

    try{
        const cpfExists = await db.query(`SELECT * FROM customers WHERE cpf=$1`
        , [cpf]);
        if(cpfExists.rowCount){
            return res.sendStatus(409);
        }

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) 
                        VALUES ($1, $2, $3, $4)`
        , [  name, phone, cpf, birthday ]);

        res.sendStatus(201);

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export async function updateCustomer(req, res){

    try{
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}