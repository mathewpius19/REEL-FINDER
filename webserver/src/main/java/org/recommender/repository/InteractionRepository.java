package org.recommender.repository;

import org.recommender.entity.Interactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InteractionRepository extends JpaRepository<Interactions, Long> {

    List<Interactions> findByUserId(Long UserId);

    Optional<Interactions> findByUserIdAndMovieId(Long userId, Long movieId);
}
