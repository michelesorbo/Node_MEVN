export default class MoviesDAO{
    static movies;

    //Mi connetto al DB e seleziono la collection movies
    static async injectDB(conn){
        if(MoviesDAO.movies){
            return;
        }

        try{
            MoviesDAO.movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection('movies');
        }catch(e){
            console.error(`unable to connect in MoviesDAO: ${e}`);
        }
    }

    //Metodo per stampare l'elenco dei movies e ci aggiungo dei filtri
    static async getMovies({ //Filtro di Default
        filters = null,
        page = 0,
        moviesPerPage = 20, //Solo 20 film per pagina
    } = {}){
        let query;
        if(filters){
            if('title' in filters){
                query = {$text: {$search: filters.title}};
            }else if('rated' in filters){
                query = {rated: {$eq: filters.rated}};
            }
        }

        let cursor;
        try{
            cursor = await MoviesDAO.movies
                .find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage*page);
            const moviesList = await cursor.toArray();
            const totalNumMovies = await MoviesDAO.movies.countDocuments(query);
            return {moviesList, totalNumMovies};
        }catch(e){
            console.log(`unable to issue find Command ${e}`);
            return { moviesList: [], totalNumMovies: 0};
        }
    }
}