# FHIR Terminology Service

A Spring Boot microservice implementing FHIR terminology operations with NAMASTE CodeSystem integration and WHO ICD-11 API support.

## Features

- **FHIR Terminology Operations**: `$expand`, `$lookup`, `$translate`
- **Autocomplete**: Search across local NAMASTE codes and ICD-11 entities
- **Translation Service**: ConceptMap-based translation with ICD-11 fallback
- **User Authentication**: JWT-based authentication with role-based access
- **CSV Upload**: Bulk upload of codes and concept maps
- **History/Audit**: Track all translation attempts and system changes
- **Caching**: Redis-based caching for ICD-11 API responses
- **Metrics**: Prometheus metrics via Actuator

## Quick Start

### Prerequisites

- Java 17+
- Maven 3.6+
- PostgreSQL 13+
- Redis 6+
- WHO ICD-11 API credentials (register at [ICD API Portal](https://icd.who.int/docs/icd-api/))

### Setup

1. **Clone and Build**
   ```bash
   git clone <repository-url>
   cd fhir-terminology-service
   mvn clean install
   ```

2. **Database Setup**
   ```sql
   CREATE DATABASE fhir_terminology;
   CREATE USER fhir_user WITH PASSWORD 'fhir_password';
   GRANT ALL PRIVILEGES ON DATABASE fhir_terminology TO fhir_user;
   ```

3. **Environment Variables**
   ```bash
   export DB_USERNAME=fhir_user
   export DB_PASSWORD=fhir_password
   export REDIS_HOST=localhost
   export REDIS_PORT=6379
   export ICD_CLIENT_ID=your_icd_client_id
   export ICD_CLIENT_SECRET=your_icd_client_secret
   export JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   ```

4. **Run Application**
   ```bash
   mvn spring-boot:run
   ```

The service will start on `http://localhost:8080`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}
```

### FHIR Terminology Endpoints

#### ValueSet $expand (Autocomplete)
```http
GET /fhir/ValueSet/$expand?filter=diabetes&count=10
```

Response:
```json
{
  "resourceType": "ValueSet",
  "url": "http://terminology.namaste.in/CodeSystem/NAMASTE",
  "expansion": {
    "total": 5,
    "offset": 0,
    "contains": [
      {
        "system": "http://terminology.namaste.in/CodeSystem/NAMASTE",
        "code": "DM-001",
        "display": "Type 1 Diabetes Mellitus"
      }
    ]
  }
}
```

#### CodeSystem $lookup
```http
GET /fhir/CodeSystem/$lookup?system=http://terminology.namaste.in/CodeSystem/NAMASTE&code=DM-001
```

#### ConceptMap $translate
```http
POST /fhir/ConceptMap/$translate
Authorization: Bearer <token>
Content-Type: application/json

{
  "system": "http://terminology.namaste.in/CodeSystem/NAMASTE",
  "code": "DM-001",
  "targetSystem": "http://id.who.int/icd/release/11/mms"
}
```

### Administrative Endpoints

#### Upload Codes CSV
```http
POST /admin/upload/codes
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

file: codes.csv
```

CSV Format:
```csv
system,code,display,definition
http://terminology.namaste.in/CodeSystem/NAMASTE,DM-001,Type 1 Diabetes,Insulin-dependent diabetes mellitus
```

#### Upload ConceptMaps CSV
```http
POST /admin/upload/conceptmaps
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

file: conceptmaps.csv
```

CSV Format:
```csv
sourceSystem,sourceCode,targetSystem,targetCode,equivalence,comment
http://terminology.namaste.in/CodeSystem/NAMASTE,DM-001,http://id.who.int/icd/release/11/mms,5A10,equivalent,Direct mapping
```

### Health Check Endpoints

```http
GET /health/about
GET /health/ready
GET /health/live
GET /actuator/health
GET /actuator/prometheus
```

## Configuration

Key configuration options in `application.yml`:

### Database
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fhir_terminology
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

### Redis Cache
```yaml
spring:
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
```

### WHO ICD-11 OAuth
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          icd:
            client-id: ${ICD_CLIENT_ID}
            client-secret: ${ICD_CLIENT_SECRET}
            authorization-grant-type: client_credentials
```

### JWT Security
```yaml
jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000 # 24 hours
```

## Development

### Project Structure
```
src/main/java/com/healthcare/fhir/
├── config/           # Configuration classes
├── controller/       # REST controllers
├── dto/             # Data transfer objects
├── entity/          # JPA entities
├── repository/      # Data access layer
├── security/        # JWT security components
└── service/         # Business logic
```

### Key Services

- **TerminologyService**: Handles ValueSet expansion and CodeSystem lookup
- **TranslationService**: ConceptMap translation with ICD-11 fallback
- **IcdSyncService**: WHO ICD-11 API integration
- **AuthService**: User authentication and registration
- **UploadService**: CSV file processing
- **AuditService**: History and audit logging

### Testing

Run tests:
```bash
mvn test
```

Integration tests require PostgreSQL and Redis to be running.

## Deployment

### Docker
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/fhir-terminology-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_USERNAME=fhir_user
      - DB_PASSWORD=fhir_password
      - REDIS_HOST=redis
      - ICD_CLIENT_ID=${ICD_CLIENT_ID}
      - ICD_CLIENT_SECRET=${ICD_CLIENT_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=fhir_terminology
      - POSTGRES_USER=fhir_user
      - POSTGRES_PASSWORD=fhir_password

  redis:
    image: redis:6-alpine
```

## Monitoring

### Prometheus Metrics
Available at `/actuator/prometheus`

Key metrics:
- `http_server_requests_*` - HTTP request metrics
- `jvm_*` - JVM memory and GC metrics
- `cache_*` - Redis cache metrics

### Grafana Dashboard
Import the provided dashboard JSON for visualization of:
- Request rate, error rate, duration (RED metrics)
- JVM memory usage
- Cache hit/miss rates
- Translation success rates

## Security

### Authentication
- JWT tokens with configurable expiration
- Role-based access control (USER, ADMIN)
- Secure password hashing with BCrypt

### API Security
- CORS configuration
- Request validation
- Rate limiting (via external reverse proxy)

### Production Considerations
- Use strong JWT secrets
- Enable HTTPS/TLS
- Configure proper CORS origins
- Set up API rate limiting
- Use secure database credentials
- Enable audit logging

## Troubleshooting

### Common Issues

1. **ICD API Authentication Errors**
    - Verify client credentials
    - Check OAuth token expiry
    - Ensure proper scopes

2. **Database Connection Issues**
    - Verify PostgreSQL is running
    - Check connection parameters
    - Ensure database exists

3. **Redis Connection Issues**
    - Verify Redis is running
    - Check connection parameters
    - Consider disabling cache for testing

### Logging
Set log levels in `application.yml`:
```yaml
logging:
  level:
    com.healthcare.fhir: DEBUG
    org.springframework.security: DEBUG
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Roadmap

- [ ] ABHA/ABDM OAuth integration
- [ ] Advanced search with Elasticsearch
- [ ] FHIR R4/R5 compliance validation
- [ ] GraphQL API support
- [ ] Multi-tenant support
- [ ] Advanced concept mapping UI
- [ ] Machine learning-based translation suggestions