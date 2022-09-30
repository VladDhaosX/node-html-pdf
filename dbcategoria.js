var config = require('./dbconfig');
const sql = require('mssql');

async function getCategorias(){
    try {
        let pool = await sql.connect(config);
        let categorias = await pool.request().query('SELECT * FROM TruckParts');
        return categorias.recordset;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getCategorias : getCategorias
}