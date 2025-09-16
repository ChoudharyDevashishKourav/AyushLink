// IcdSyncService.java
package com.healthcare.fhir.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class IcdSyncService {

    private static final Logger logger = LoggerFactory.getLogger(IcdSyncService.class);

    @Value("${icd.api.base-url}")
    private String icdBaseUrl;

    @Value("${icd.api.version}")
    private String apiVersion;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    @Autowired
    private IcdOAuthService icdOAuthService;

    @Cacheable(value = "icdEntities", key = "#entityId")
    public JsonNode resolveEntity(String entityId) {
        try {
            String url = String.format("%s/entity/%s", icdBaseUrl, entityId);
            String accessToken = icdOAuthService.getAccessToken();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.set("API-Version", apiVersion);
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                logger.info("Successfully resolved ICD entity: {}", entityId);
                return jsonNode;
            } else {
                logger.error("Failed to resolve ICD entity: {} - Status: {}", entityId, response.getStatusCode());
                return null;
            }
        } catch (Exception e) {
            logger.error("Error resolving ICD entity: {}", entityId, e);
            return null;
        }
    }

    @Cacheable(value = "icdSearch", key = "#query")
    public List<JsonNode> searchEntities(String query) {
        try {
            String url = String.format("%s/release/11/2023-01/mms/search?q=%s&useFlexisearch=true", icdBaseUrl, query);
            String accessToken = icdOAuthService.getAccessToken();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.set("API-Version", apiVersion);
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode destinationEntities = rootNode.get("destinationEntities");

                List<JsonNode> results = new ArrayList<>();
                if (destinationEntities != null && destinationEntities.isArray()) {
                    for (JsonNode node : destinationEntities) {
                        results.add(node);
                    }
                }

                logger.info("Successfully searched ICD entities for query: {} - Found {} results", query, results.size());
                return results;
            } else {
                logger.error("Failed to search ICD entities for query: {} - Status: {}", query, response.getStatusCode());
                return new ArrayList<>();
            }
        } catch (Exception e) {
            logger.error("Error searching ICD entities for query: {}", query, e);
            return new ArrayList<>();
        }
    }

    public Map<String, Object> getSystemInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("icdBaseUrl", icdBaseUrl);
        info.put("apiVersion", apiVersion);
        info.put("lastSync", System.currentTimeMillis());
        return info;
    }
}






