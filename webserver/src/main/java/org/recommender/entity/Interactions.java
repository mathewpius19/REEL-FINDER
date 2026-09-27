package org.recommender.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interactions")
public class Interactions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long movieId;

    private double rating;

    private int clicks;

    private boolean watched;

    private LocalDateTime lastInteraction;

    // getters & setters


    public Interactions() {
    }

    public Interactions(Long id, Long userId, Long movieId, double rating, int clicks, boolean watched, LocalDateTime lastInteraction) {
        this.id = id;
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
        this.clicks = clicks;
        this.watched = watched;
        this.lastInteraction = lastInteraction;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    @Override
    public String toString() {
        return "Interactions{" +
                "id=" + id +
                ", userId=" + userId +
                ", movieId=" + movieId +
                ", rating=" + rating +
                ", clicks=" + clicks +
                ", watched=" + watched +
                ", lastInteraction=" + lastInteraction +
                '}';
    }
}
