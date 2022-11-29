var config = require('./dbconfig');
const sql = require('mssql');
const microprofiler = require('microprofiler');

async function getCategorias() {
    try {
        let start = microprofiler.start();
        let pool = await sql.connect(config);
        let categorias = await pool.request().query(`SELECT Photo AS Photo FROM Audit_VINs_Photos WHERE AuditVINId IN (
            SELECT AuditVINId FROM Audit_VINs WHERE AuditId = 17062)`);
        let elapsedUs = microprofiler.measureFrom(start);
        console.log("Tiempo de Consulta:" + elapsedUs);
        return categorias.recordset;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getCategorias: getCategorias
}