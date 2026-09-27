package org.recommender.dto.request;


import org.recommender.entity.Interactions;

import java.time.LocalDateTime;

public class InteractionDTO {

    private Long movieId;
    private double rating;
    private int clicks;
    private boolean watched;
    private LocalDateTime lastInteraction;

    public InteractionDTO(Interactions interactions) {
        movieId = interactions.getMovieId();
        rating = interactions.getRating();
        clicks = interactions.getClicks();
        watched = interactions.isWatched();
        lastInteraction = interactions.getLastInteraction();
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getClicks() {
        return clicks;
    }

    public void setClicks(int clicks) {
        this.clicks = clicks;
    }

    public boolean isWatched() {
        return watched;
    }

    public void setWatched(boolean watched) {
        this.watched = watched;
    }

    public LocalDateTime getLastInteraction() {
        return lastInteraction;
    }

    public void setLastInteraction(LocalDateTime lastInteraction) {
        this.lastInteraction = lastInteraction;
    }
}