import db from '../db.js'

export async function getCustomers(req, res){
    const queryCPF = req.query.cpf;

    try{
        const customers = await db.query(`SELECT * FROM customers`);

        if(!queryCPF){
            return res.send(customers.rows);
        }

        const regex = new RegExp(`\^${queryCPF}`);
        const filterCustomers = customers.rows.filter(customer => {
            return regex.test(customer.cpf)
        })

        res.send(filterCustomers)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export async function getCustomer(req, res){
    const { id } = req.params;

    try{
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1`
        , [id]);

        if(!customer.rows[0]){
            return res.sendStatus(404);
        }

        res.send(customer.rows[0])

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