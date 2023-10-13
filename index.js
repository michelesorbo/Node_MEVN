import express from 'express';
import cors from 'cors';
import MoviesRoute from './api/MoviesRoute.js';
import dotenv from 'dotenv';
import mongodb from 'mongodb';
import MoviesDAO from './dao/MoviesDAO.js';

class Index{
    static app = express();
    static router = express.Router();

    static main(){
        dotenv.config(); //Vado a leggere le configurazione nel .env
        //console.log(process.env.MOVIEREVIEWS_DB_URI)
        //Scrivo il codice di partenza
        //Far partire il servev
        Index.setUpserver();
        Index.setUpDatabase();
    }

    //Set Up del Server
    static setUpserver(){
        Index.app.use(cors()); //Uso le middelware
        Index.app.use(express.json()); //Serve per fare il parse di JSON

        //Voglio creare la gestione delle Route
        Index.app.use('/api/v1/movies', MoviesRoute.configRoutes(Index.router));
        //Gestisco tutte le rout non conosciute
        Index.app.use('*',(req,res)=>{
            res.status(404).json({error:'Page non faound'});
        });
    }

    //Connessione al DB e lancio del servizio
    static async setUpDatabase(){
        const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI);
        const port = process.env.PORT || 8000;

        //Connetto il DB
        try{
            await client.connect();
            await MoviesDAO.injectDB(client);
            Index.app.listen(port,()=>{
                console.log(`Server is runningo on port: ${port}`);
            });
        }catch (e){
            console.log(e);
            process.exit(1);
        }
    }
}

Index.main();