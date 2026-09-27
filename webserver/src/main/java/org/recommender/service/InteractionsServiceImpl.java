package org.recommender.service;

import org.recommender.entity.Interactions;
import org.recommender.repository.InteractionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InteractionsServiceImpl implements InteractionsService{

    InteractionRepository interactionRepository;

    public InteractionsServiceImpl(InteractionRepository interactionRepository) {
        this.interactionRepository = interactionRepository;
    }

    @Override
    public List<Interactions> getInteractionsByUserId(Long userId){
        return interactionRepository.findByUserId(userId);
    }

    @Override
    public Interactions saveInteraction(Interactions interaction) {
        if (interaction.getUserId() == null || interaction.getMovieId() == null) {
            throw new RuntimeException("User id and movie id are required");
        }

        Interactions existingInteraction = interactionRepository
                .findByUserIdAndMovieId(interaction.getUserId(), interaction.getMovieId())
                .orElse(null);

        if (existingInteraction == null) {
            existingInteraction = new Interactions();
            existingInteraction.setUserId(interaction.getUserId());
            existingInteraction.setMovieId(interaction.getMovieId());
        }

        existingInteraction.setClicks(Math.max(interaction.getClicks(), 0));
        existingInteraction.setRating(interaction.getRating());
        existingInteraction.setWatched(interaction.isWatched());
        existingInteraction.setLastInteraction(
                interaction.getLastInteraction() != null ? interaction.getLastInteraction() : LocalDateTime.now()
        );

        return interactionRepository.save(existingInteraction);
    }
}
