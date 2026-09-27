package org.recommender.rest;

import org.recommender.dto.request.SearchRequest;
import org.recommender.dto.response.MovieIdsResponse;
import org.recommender.dto.response.MovieResponse;
import org.recommender.entity.Interactions;
import org.recommender.entity.Movies;
import org.recommender.entity.User;
import org.recommender.repository.MovieRepository;
import org.recommender.service.InteractionsService;
import org.recommender.service.MovieService;
import org.recommender.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

//Define routes
@RestController
@RequestMapping("/recommender")
public class Routes {

    MovieService movieService;
    UserService userService;
    InteractionsService interactionsService;

    public Routes(UserService userService, MovieService movieService, InteractionsService interactionsService) {
        this.userService = userService;
        this.movieService = movieService;
        this.interactionsService = interactionsService;
    }

    @GetMapping("/home")
    public String displayHome(){
        return "Welcome Home";
    }

    @GetMapping("/users")
    public List<User> getUsers(){

        return userService.findAll();
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try{
            System.out.print("Saving User....");
            User saved = userService.signup(user.getEmail(), user.getPassword(), user.getUserName(), user.getGenrePref());
            return ResponseEntity.ok(saved);
        }
        catch(RuntimeException e){
            System.out.print("User signup validation failed: " + e.getMessage());
            // return a 409 Conflict for duplicate email, otherwise 400
            String msg = e.getMessage() != null ? e.getMessage() : "Signup failed";
            if (msg.toLowerCase().contains("exists") || msg.toLowerCase().contains("already")) {
                return ResponseEntity.status(409).body(Map.of("message", msg));
            }
            return ResponseEntity.badRequest().body(Map.of("message", msg));
        }
        catch(Exception e){
            System.out.print("Error while saving User....");
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) throws Exception{
        try{
            System.out.println("Validating User...");
            return userService.login(user.getEmail(), user.getPassword());
        }
        catch(Exception e){
            System.out.println("Error while logging in..");
            throw new Exception(e.getMessage());
        }
    }
    @DeleteMapping("/delete")
    public User deleteUser(@RequestBody User user) throws Exception{
        try{
            System.out.println("Deleting User...");
            return userService.deleteUser(user.getEmail(), user.getPassword());
        }
        catch(Exception e){
            System.out.println("Error while logging in..");
            throw new Exception(e.getMessage());
        }
    }

    // movie routes

    @GetMapping("/movies")
    public List<Movies> getMovies(){
        return movieService.findAll();
    }

    @PostMapping("/movies")
    public Movies getMoviesById(@RequestBody Movies movie){

        if(movie.getMovieId()!=0){
            System.out.println("Finding movie id...");
            return movieService.findMovieById(movie.getMovieId());
        }
        else{
            System.out.println("movie id not valid...");
            return null;
        }
    }

    @PostMapping("/movies/byIds")
    public List<Movies> getMoviesByIds(@RequestBody List<Long> movieIds){

        if(movieIds!=null && !movieIds.isEmpty()){
       movieIds = movieIds.stream().filter(Objects::nonNull)
               .toList();
            return movieService.findMovieByIds(movieIds);
        }
        else{
            return new ArrayList<>();
        }
    }

    @PostMapping("/movies/search")
    public MovieIdsResponse getMoviesByQuery(@RequestBody SearchRequest searchQuery) {
        String query = searchQuery.getQuery();
        if (query != null && !query.trim().isEmpty()) {
            return movieService.recommendMoviesByQuery(query);
        }
        MovieIdsResponse response = new MovieIdsResponse();
        response.setType("assistant");
        response.setResponse("Please enter a question or describe what you want to watch.");
        response.setMovieIds(List.of());
        response.setMovies(List.of());
        return response;
    }

    @GetMapping("/movies/userRecommendations")
    public List<MovieResponse> getMoviesForUser(@RequestParam(value = "userId") Long userId){

        return movieService.recommendMoviesByUserId(userId);

    }

    @GetMapping("/interactions")
    public List<Interactions> getInteractionsForUser(@RequestParam(value = "userId") Long userId) {
        return interactionsService.getInteractionsByUserId(userId);
    }

    @PostMapping("/interactions")
    public Interactions saveInteraction(@RequestBody Interactions interaction) {
        return interactionsService.saveInteraction(interaction);
    }


}

