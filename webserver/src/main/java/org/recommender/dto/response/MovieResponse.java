package org.recommender.dto.response;

import java.util.List;

public class MovieResponse {

    private Long movieId;
    private String title;
    private String genres;
    private String posterUrl;

    public MovieResponse(Long movieId, String title, String genres, String posterUrl) {
        this.movieId = movieId;
        this.title = title;
        this.genres = genres;
        this.posterUrl = posterUrl;
    }

    public Long getMovieId() { return movieId; }
    public String getTitle() { return title; }
    public String getGenres() { return genres; }
    public String getPosterUrl() { return posterUrl; }

    @Override
    public String toString() {
        return "MovieResponse{" +
                "movieId=" + movieId +
                ", title='" + title + '\'' +
                ", genres='" + genres + '\'' +
                ", posterUrl='" + posterUrl + '\'' +
                '}';
    }
}