import MoviesController from "./MoviesController.js";

export default class MoviesRoute{

    //Creo il metodo per le route
    static configRoutes(router){
        router.route('/').get(MoviesController.apiGetMovies);
        return router;
    }

}