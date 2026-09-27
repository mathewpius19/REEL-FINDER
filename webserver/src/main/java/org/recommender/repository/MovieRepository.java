package org.recommender.repository;

import org.recommender.entity.Movies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movies,Long> {

    Optional<Movies> findByMovieId(Long movieId);

    @Query("SELECT m FROM Movies m WHERE m.movieId IN :movieIds")
    List<Movies> findByMovieIdIn (@Param("movieIds") List<Long> movieIds);
}
