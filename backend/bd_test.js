import mysql from 'mysql2';
import { expect } from 'chai';

describe('Base de datos', () => {
  it('Conexión a la base de datos', (done) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'pris1'
    });

    connection.connect((err) => {
      if (err) {
        done(err);
      } else {
        expect(true).to.equal(true); 
        connection.end();
        done();
      }
    });
  });
});