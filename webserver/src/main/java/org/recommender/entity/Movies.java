package org.recommender.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
public class Movies {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long movieId;

    private String title;

    @Column(length = 1000)
    private String genres;

    @Column(columnDefinition = "TEXT")
    private String tags;

    @Column(columnDefinition = "TEXT")
    private String text;

    private Long tmdbId;

    private String posterUrl;

    // getters & setters

    public Movies() {
    }

    public Movies(Long id, Long movieId, String title, String genres, String tags, String text, Long tmdbId, String posterUrl) {
        this.id = id;
        this.movieId = movieId;
        this.title = title;
        this.genres = genres;
        this.tags = tags;
        this.text = text;
        this.tmdbId = tmdbId;
        this.posterUrl = posterUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(String genres) {
        this.genres = genres;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getTmdbId() {
        return tmdbId;
    }

    public void setTmdbId(Long tmdbId) {
        this.tmdbId = tmdbId;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    @Override
    public String toString() {
        return "Movies{" +
                "id=" + id +
                ", movieId=" + movieId +
                ", title='" + title + '\'' +
                ", genres='" + genres + '\'' +
                ", tags='" + tags + '\'' +
                ", text='" + text + '\'' +
                ", tmdbId=" + tmdbId +
                ", posterUrl='" + posterUrl + '\'' +
                '}';
    }
}
