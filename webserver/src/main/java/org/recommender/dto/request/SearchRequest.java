package org.recommender.dto.request;


import com.fasterxml.jackson.annotation.JsonProperty;

public class SearchRequest {

    @JsonProperty("query")
    private String query;

    public SearchRequest(String query) {
        this.query = query;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {

        this.query = query;
    }
}