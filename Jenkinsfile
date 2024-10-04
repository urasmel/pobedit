pipeline {
    agent any

    environment {
        // Set environment variables if needed
        DOTNET_CLI_VERSION = '6.0.100' // Specify your .NET SDK version
        DOCKER_IMAGE_NAME = 'your-docker-image-name'
        DOCKER_IMAGE_TAG = 'latest'
    }
    stages {
        stage('Testing ControlService') {
            steps {
                dir('./backend/services/tests/ControlService.Tests/') {
                    powershell 'dotnet test'
                }
            }
        }
        stage('Testing GatherService') {
            steps {
                dir('./backend/services/tests/GatherService.Tests/') {
                    powershell 'dotnet test'
                }
            }
        }
        stage('Testing frontend') {
            steps {
                dir('./frontend/') {
                    powershell 'npm install'
                    powershell 'npm run test'
                }
            }
        }
        stage('Generating a database generation script') {
            steps {
                dir('./backend/services/ControlService/') {
                    powershell 'dir'
                    powershell 'dotnet tool install --global dotnet-ef'
                    powershell 'dotnet ef --version'
                    powershell 'dotnet ef migrations script -v -o "../../../db/scripts/create_db.sql"'
                }
            }
        }
        stage('Building and running docker-compose with GastherService, ControlService and Frontend') {
            steps {
                    powershell 'docker compose -f "compose.yaml" up -d --build'
            }
        }
    }
    post {
        always {
                // Clean up workspace
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
