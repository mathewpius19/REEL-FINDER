package org.recommender.dto.request;



import java.util.List;

public class RecommendationRequest {

    private Long userId;
    private List<String> genrePref;
    private List<InteractionDTO> interactions;

    public RecommendationRequest(Long userId, List<String> genrePref, List<InteractionDTO> interactions) {
        this.userId = userId;
        this.genrePref = genrePref;
        this.interactions = interactions;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<String> getGenrePref() {
        return genrePref;
    }

    public void setGenrePref(List<String> genrePref) {
        this.genrePref = genrePref;
    }

    public List<InteractionDTO> getInteractions() {
        return interactions;
    }

    public void setInteractions(List<InteractionDTO> interactions) {
        this.interactions = interactions;
    }
}
