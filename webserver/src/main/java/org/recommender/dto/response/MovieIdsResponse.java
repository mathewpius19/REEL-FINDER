package org.recommender.dto.response;

import java.util.List;

public class MovieIdsResponse {

    private String type;
    private List<Long> movieIds = List.of();
    private String response;
    private String content;
    private List<MovieResponse> movies = List.of();

    public List<Long> getMovieIds() {
        return movieIds;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<MovieResponse> getMovies() {
        return movies;
    }

    public void setMovies(List<MovieResponse> movies) {
        this.movies = movies;
    }

    @Override
    public String toString() {
        return "MovieIdsResponse{" +
                "movieIds=" + movieIds +
                ", type='" + type + '\'' +
                ", response='" + response + '\'' +
                ", content='" + content + '\'' +
                ", movies=" + movies +
                '}';
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setMovieIds(List<Long> movieIds) {
        this.movieIds = movieIds;
    }
}
