# AyushLink - Complete Installation Guide

This guide provides step-by-step instructions to install and run the AyushLink FHIR Terminology Service with both backend and frontend components.

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **Network**: Internet connection for downloading dependencies

## Prerequisites Installation

### 1. Java Development Kit (JDK) 17+

**Windows:**
```powershell
# Download from Oracle or use OpenJDK
# Option 1: Download from https://adoptium.net/
# Option 2: Using Chocolatey
choco install openjdk17

# Option 3: Using Scoop
scoop install openjdk17

# Verify installation
java -version
javac -version
```

**macOS:**
```bash
# Using Homebrew
brew install openjdk@17

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"

# Verify installation
java -version
```

**Linux (Ubuntu/Debian):**
```bash
# Update package list
sudo apt update

# Install OpenJDK 17
sudo apt install openjdk-17-jdk

# Verify installation
java -version
```

### 2. Apache Maven 3.6+

**Windows:**
```powershell
# Option 1: Download from https://maven.apache.org/download.cgi
# Option 2: Using Chocolatey
choco install maven

# Option 3: Using Scoop
scoop install maven

# Verify installation
mvn -version
```

**macOS:**
```bash
# Using Homebrew
brew install maven

# Verify installation
mvn -version
```

**Linux (Ubuntu/Debian):**
```bash
# Install Maven
sudo apt install maven

# Verify installation
mvn -version
```

### 3. Node.js 18+ and npm

**Windows:**
```powershell
# Option 1: Download from https://nodejs.org/
# Option 2: Using Chocolatey
choco install nodejs

# Option 3: Using Scoop
scoop install nodejs

# Verify installation
node --version
npm --version
```

**macOS:**
```bash
# Using Homebrew
brew install node

# Verify installation
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 4. PostgreSQL 13+

**Windows:**
```powershell
# Option 1: Download from https://www.postgresql.org/download/windows/
# Option 2: Using Chocolatey
choco install postgresql

# Start PostgreSQL service
net start postgresql-x64-13
```

**macOS:**
```bash
# Using Homebrew
brew install postgresql@13

# Start PostgreSQL
brew services start postgresql@13
```

**Linux (Ubuntu/Debian):**
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 5. Redis 6+

**Windows:**
```powershell
# Option 1: Download from https://github.com/microsoftarchive/redis/releases
# Option 2: Using Chocolatey
choco install redis-64

# Start Redis
redis-server
```

**macOS:**
```bash
# Using Homebrew
brew install redis

# Start Redis
brew services start redis
```

**Linux (Ubuntu/Debian):**
```bash
# Install Redis
sudo apt install redis-server

# Start Redis service
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AyushLink
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd Backend
```

#### Install Backend Dependencies
```bash
# Maven will automatically download all dependencies from pom.xml
mvn clean install

# This will download:
# - Spring Boot 3.4.9 and all starters
# - Spring Security with OAuth2
# - PostgreSQL JDBC driver
# - Redis client
# - JWT libraries (Nimbus JOSE JWT)
# - CSV processing (OpenCSV)
# - Metrics and Actuator
# - Testing frameworks
```

#### Database Setup
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database and user
CREATE DATABASE fhir_terminology;
CREATE USER fhir_user WITH PASSWORD 'fhir_password';
GRANT ALL PRIVILEGES ON DATABASE fhir_terminology TO fhir_user;

-- Exit psql
\q
```

#### Environment Variables Setup
Create a `.env` file in the Backend directory:
```bash
# Database Configuration
DB_USERNAME=fhir_user
DB_PASSWORD=fhir_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# WHO ICD-11 API Credentials (Register at https://icd.who.int/docs/icd-api/)
ICD_CLIENT_ID=your_icd_client_id_here
ICD_CLIENT_SECRET=your_icd_client_secret_here

# JWT Secret (Generate a secure random string)
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure_at_least_256_bits

# Optional: Development mode (disables security and cache)
SPRING_PROFILES_ACTIVE=dev
```

**Windows PowerShell:**
```powershell
# Set environment variables
$env:DB_USERNAME="fhir_user"
$env:DB_PASSWORD="fhir_password"
$env:REDIS_HOST="localhost"
$env:REDIS_PORT="6379"
$env:ICD_CLIENT_ID="your_icd_client_id_here"
$env:ICD_CLIENT_SECRET="your_icd_client_secret_here"
$env:JWT_SECRET="your_jwt_secret_key_here_make_it_long_and_secure_at_least_256_bits"
$env:SPRING_PROFILES_ACTIVE="dev"
```

**macOS/Linux:**
```bash
# Export environment variables
export DB_USERNAME="fhir_user"
export DB_PASSWORD="fhir_password"
export REDIS_HOST="localhost"
export REDIS_PORT="6379"
export ICD_CLIENT_ID="your_icd_client_id_here"
export ICD_CLIENT_SECRET="your_icd_client_secret_here"
export JWT_SECRET="your_jwt_secret_key_here_make_it_long_and_secure_at_least_256_bits"
export SPRING_PROFILES_ACTIVE="dev"
```

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../Frontend
```

#### Install Frontend Dependencies
```bash
# Install all dependencies from package.json
npm install

# This will install:
# - React 18.2.0
# - React Router DOM 6.20.1
# - TanStack React Query 5.8.0
# - Lucide React (icons)
# - TypeScript 5.2.2
# - Vite 4.5.0
# - Tailwind CSS 3.3.5
# - ESLint and related plugins
# - PostCSS and Autoprefixer
```

## Running the Application

### 1. Start Required Services

#### Start PostgreSQL
**Windows:**
```powershell
net start postgresql-x64-13
```

**macOS:**
```bash
brew services start postgresql@13
```

**Linux:**
```bash
sudo systemctl start postgresql
```

#### Start Redis
**Windows:**
```powershell
redis-server
```

**macOS:**
```bash
brew services start redis
```

**Linux:**
```bash
sudo systemctl start redis-server
```

### 2. Start Backend Application

```bash
cd Backend

# Run the Spring Boot application
mvn spring-boot:run

# Or build and run JAR
mvn clean package
java -jar target/fhir-terminology-service-0.0.1-SNAPSHOT.jar
```

The backend will start on `http://localhost:8080`

### 3. Start Frontend Application

```bash
cd Frontend

# Start development server
npm run dev

# Or build for production
npm run build
npm run preview
```

The frontend will start on `http://localhost:5173` (Vite default port)

## Verification

### 1. Backend Health Check
```bash
# Test backend endpoints
curl http://localhost:8080/health/about
curl http://localhost:8080/health/ready
curl http://localhost:8080/health/live
```

### 2. Frontend Access
Open your browser and navigate to `http://localhost:5173`

### 3. API Documentation
- Backend API: `http://localhost:8080`
- Health endpoints: `http://localhost:8080/actuator/health`
- Prometheus metrics: `http://localhost:8080/actuator/prometheus`

## Development Mode

For development with relaxed security and no cache:

```bash
# Set development profile
export SPRING_PROFILES_ACTIVE=dev

# Or run with profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## Production Setup

### 1. Environment Variables for Production
```bash
# Use strong passwords and secrets
export DB_USERNAME="production_user"
export DB_PASSWORD="strong_production_password"
export JWT_SECRET="very_long_and_secure_jwt_secret_key_for_production"
export ICD_CLIENT_ID="production_icd_client_id"
export ICD_CLIENT_SECRET="production_icd_client_secret"

# Disable development profile
unset SPRING_PROFILES_ACTIVE
```

### 2. Build Production JAR
```bash
cd Backend
mvn clean package -Pproduction
```

### 3. Build Production Frontend
```bash
cd Frontend
npm run build
```

## Troubleshooting

### Common Issues

#### 1. Java Version Issues
```bash
# Check Java version
java -version

# If wrong version, update JAVA_HOME
export JAVA_HOME=/path/to/java17
```

#### 2. Database Connection Issues
```bash
# Test PostgreSQL connection
psql -h localhost -U fhir_user -d fhir_terminology

# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS
```

#### 3. Redis Connection Issues
```bash
# Test Redis connection
redis-cli ping

# Check if Redis is running
sudo systemctl status redis-server  # Linux
brew services list | grep redis  # macOS
```

#### 4. Port Conflicts
```bash
# Check if ports are in use
netstat -tulpn | grep :8080  # Backend port
netstat -tulpn | grep :5173  # Frontend port
netstat -tulpn | grep :5432  # PostgreSQL port
netstat -tulpn | grep :6379  # Redis port
```

#### 5. Maven Build Issues
```bash
# Clean and rebuild
mvn clean install -U

# Skip tests if needed
mvn clean install -DskipTests
```

#### 6. npm Install Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Docker Setup (Alternative)

If you prefer using Docker:

### 1. Install Docker
- Download from https://www.docker.com/products/docker-desktop

### 2. Create Docker Compose File
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: fhir_terminology
      POSTGRES_USER: fhir_user
      POSTGRES_PASSWORD: fhir_password
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./Backend
    ports:
      - "8080:8080"
    environment:
      - DB_USERNAME=fhir_user
      - DB_PASSWORD=fhir_password
      - REDIS_HOST=redis
      - ICD_CLIENT_ID=${ICD_CLIENT_ID}
      - ICD_CLIENT_SECRET=${ICD_CLIENT_SECRET}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./Frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

### 3. Run with Docker
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [WHO ICD-11 API Documentation](https://icd.who.int/docs/icd-api/)

## Support

If you encounter any issues during installation, please check:
1. All prerequisites are installed correctly
2. All services (PostgreSQL, Redis) are running
3. Environment variables are set properly
4. Ports are not in use by other applications
5. Firewall settings allow connections to required ports



