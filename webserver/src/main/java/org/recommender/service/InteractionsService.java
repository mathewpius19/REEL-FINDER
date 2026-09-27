package org.recommender.service;

import org.recommender.entity.Interactions;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InteractionsService{

    List<Interactions> getInteractionsByUserId(Long userId);

    Interactions saveInteraction(Interactions interaction);
}
