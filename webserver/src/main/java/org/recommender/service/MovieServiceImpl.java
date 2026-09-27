package org.recommender.service;

import org.recommender.dto.request.InteractionDTO;
import org.recommender.dto.request.RecommendationRequest;
import org.recommender.dto.request.SearchRequest;
import org.recommender.dto.response.MovieIdsResponse;
import org.recommender.dto.response.MovieResponse;
import org.recommender.entity.Interactions;
import org.recommender.entity.Movies;
import org.recommender.repository.MovieRepository;
import org.recommender.webClient.RecommenderClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collector;

@Service
public class MovieServiceImpl implements MovieService{

    UserService userService;
    InteractionsService interactionsService;
    MovieRepository movieRepository;
    private final WebClient flaskApiClient;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository, WebClient flaskApiClient, UserService userService, InteractionsService interactionsService){

        this.movieRepository = movieRepository;
        this.flaskApiClient = flaskApiClient;
        this.userService = userService;
        this.interactionsService = interactionsService;
    }

    public List<Movies> findAll(){
        return movieRepository.findAll();
    }

    @Override
    public Movies findMovieById(Long movieId) {

        return movieRepository.findByMovieId(movieId)
                .orElseThrow(()-> new RuntimeException(" movie not found..."));
    }

    @Override
    public List<Movies> findMovieByIds(List<Long> movieIds) {
        return movieRepository.findByMovieIdIn (movieIds);
    }

    @Override
    public MovieIdsResponse recommendMoviesByQuery(String query){

        SearchRequest searchQuery = new SearchRequest(query.replaceAll("\n", ""));
        ObjectMapper mapper = new ObjectMapper();
        System.out.println("Request JSON being sent :" + mapper.writeValueAsString(searchQuery));
        MovieIdsResponse response = flaskApiClient.
                post()
                .uri("search")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(searchQuery)
                .retrieve()
                .bodyToMono(MovieIdsResponse.class)
                .block();
        if (response == null) {
            response = new MovieIdsResponse();
            response.setType("assistant");
            response.setResponse("I could not produce a response. Please try again.");
            response.setMovieIds(List.of());
            response.setMovies(List.of());
            return response;
        }

        String responseType = "movie_recommendation".equals(response.getType())
                ? "movie_recommendation"
                : "assistant";
        String responseText = response.getResponse() != null
                ? response.getResponse()
                : response.getContent();
        response.setType(responseType);
        response.setResponse(responseText == null ? "" : responseText);

        if (!"movie_recommendation".equals(responseType)) {
            response.setMovieIds(List.of());
            response.setMovies(List.of());
            return response;
        }

        List<Long> movieIds = response.getMovieIds() == null ? List.of() : response.getMovieIds();
        System.out.println("response from agent " + response + " movieIds " + movieIds);

        if (!movieIds.isEmpty()) {

            System.out.println("Agent response: " + response);
            System.out.println("Movie IDs: " + movieIds);

            List<MovieResponse> movies = movieIds.stream()
                    .map(movieId -> {
                        System.out.println("Looking up movieId: " + movieId);

                        var movieOpt = movieRepository.findByMovieId(movieId);

                        System.out.println(
                                "Found " + movieId + ": " + movieOpt.isPresent()
                        );

                        return movieOpt.orElse(null);
                    })
                    .filter(Objects::nonNull)
                    .map(movie -> {
                        System.out.println(
                                "Mapping movie: " +
                                        movie.getMovieId() + " " +
                                        movie.getTitle()
                        );

                        return new MovieResponse(
                                movie.getMovieId(),
                                movie.getTitle(),
                                movie.getGenres(),
                                movie.getPosterUrl()
                        );
                    })
                    .toList();

            System.out.println("Final movie responses: " + movies);

            response.setMovies(movies);
            return response;
        }

        System.out.println("No movies found...");
        response.setMovies(List.of());
        return response;
    }

    public List<MovieResponse> recommendMoviesByUserId(Long userId){

        if(userId!=0){
            List<String> genres = userService.getUserPrefGenres(userId);
            List<Interactions> interactions = interactionsService.getInteractionsByUserId(userId);
            List<InteractionDTO> userInteractions = interactions
                    .stream()
                    .map(InteractionDTO::new)
                    .toList();

            RecommendationRequest request = new RecommendationRequest(userId,genres,userInteractions);
            try {
                MovieIdsResponse response = flaskApiClient.
                        post()
                        .uri("buildUserPreferences")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(request)
                        .retrieve()
                        .bodyToMono(MovieIdsResponse.class)
                        .block();
                System.out.println(response);

                if (response!=null && !response.getMovieIds().isEmpty()) {
                    System.out.println(response.toString());
                    return response.getMovieIds().stream()
                            .map(movieId -> movieRepository.findByMovieId(movieId).
                                    orElse(null)).filter(Objects::nonNull).
                            map(movie -> new MovieResponse(movie.getMovieId(), movie.getTitle(), movie.getGenres(), movie.getPosterUrl()))
                            .toList();
                }
            } catch (WebClientResponseException exception) {
                System.out.println("ML recommendation service failed with status " + exception.getStatusCode());
                System.out.println("ML recommendation service response: " + exception.getResponseBodyAsString());
            } catch (RuntimeException exception) {
                System.out.println("ML recommendation request failed: " + exception.getMessage());
            }
            return fallbackRecommendations(genres, interactions);

        }
        return null;
    }

    private List<MovieResponse> fallbackRecommendations(List<String> genres, List<Interactions> interactions) {
        Set<Long> seenMovieIds = interactions.stream()
                .map(Interactions::getMovieId)
                .filter(Objects::nonNull)
                .collect(java.util.stream.Collectors.toSet());

        List<String> normalizedGenres = genres == null ? List.of() : genres.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(genre -> !genre.isEmpty())
                .map(String::toLowerCase)
                .toList();

        return movieRepository.findAll().stream()
                .filter(movie -> movie.getMovieId() != null)
                .filter(movie -> !seenMovieIds.contains(movie.getMovieId()))
                .map(movie -> new ScoredMovie(movie, scoreMovie(movie, normalizedGenres)))
                .filter(scoredMovie -> scoredMovie.score > 0 || normalizedGenres.isEmpty())
                .sorted(Comparator.comparingInt(ScoredMovie::score).reversed()
                        .thenComparing(scoredMovie -> scoredMovie.movie.getTitle(), String.CASE_INSENSITIVE_ORDER))
                .limit(12)
                .map(scoredMovie -> new MovieResponse(
                        scoredMovie.movie.getMovieId(),
                        scoredMovie.movie.getTitle(),
                        scoredMovie.movie.getGenres(),
                        scoredMovie.movie.getPosterUrl()))
                .toList();
    }

    private int scoreMovie(Movies movie, List<String> normalizedGenres) {
        if (movie.getGenres() == null || normalizedGenres.isEmpty()) {
            return 0;
        }

        String movieGenres = movie.getGenres().toLowerCase();
        int score = 0;

        for (String genre : normalizedGenres) {
            if (movieGenres.contains(genre)) {
                score++;
            }
        }

        return score;
    }

    private record ScoredMovie(Movies movie, int score) {}

}
