
// IcdOAuthService.java
package com.healthcare.fhir.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Service;

@Service
public class IcdOAuthService {

    private static final Logger logger = LoggerFactory.getLogger(IcdOAuthService.class);
    private static final String CLIENT_REGISTRATION_ID = "icd";

    @Autowired
    private OAuth2AuthorizedClientManager authorizedClientManager;

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    @Cacheable(value = "icdTokens", key = "'access_token'")
    public String getAccessToken() {
        try {
            ClientRegistration clientRegistration = clientRegistrationRepository.findByRegistrationId(CLIENT_REGISTRATION_ID);
            if (clientRegistration == null) {
                throw new RuntimeException("Client registration not found for: " + CLIENT_REGISTRATION_ID);
            }

            OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
                    .withClientRegistrationId(CLIENT_REGISTRATION_ID)
                    .principal("icd-service") // service principal name
                    .build();

            OAuth2AuthorizedClient authorizedClient = authorizedClientManager.authorize(authorizeRequest);

            if (authorizedClient != null) {
                OAuth2AccessToken accessToken = authorizedClient.getAccessToken();
                logger.debug("Successfully obtained ICD OAuth2 access token");
                return accessToken.getTokenValue();
            } else {
                throw new RuntimeException("Failed to obtain OAuth2 authorized client for ICD API");
            }
        } catch (Exception e) {
            logger.error("Error obtaining ICD OAuth2 access token", e);
            throw new RuntimeException("Failed to obtain ICD access token", e);
        }
    }
}