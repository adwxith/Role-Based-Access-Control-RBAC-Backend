const { Pool } =require ('pg')

const pool =new Pool({
    user: 'postgres',  
    host: 'postgres',      
    database: 'authdb',  
    password: 'postgres',  
});

module.exports = pool