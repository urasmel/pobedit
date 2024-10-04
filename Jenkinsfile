pipeline {
    agent any

    environment {
        // Set environment variables if needed
        DOTNET_CLI_VERSION = '6.0.100' // Specify your .NET SDK version
        DOCKER_IMAGE_NAME = 'your-docker-image-name'
        DOCKER_IMAGE_TAG = 'latest'
    }
    stages {
        stage("Testing ControlService"){
            steps{
                echo "Testing ControlService..."
            }
        }
        stage("Testing GatherService"){
            steps{
                echo "Testing GatherService..."
            }
        }
        stage("Testing frontend"){
            steps{
                echo "Testing frontend..."
            }
        }
        stage("Generating a database generation script"){
            steps{
                dir('./backend/services/ControlService/'){
                    powershell 'Dir'
                    powershell 'dotnet ef migrations script --project "ControlMicroservice.csproj" --output "../../../db/scripts/create_db.sql"'
                    // powershell dotnet ef migrations script --verbose -i --project "c:\Users\protype\projects\pobedit\backend\services\ControlService\ControlMicroservice.csproj"
                }
            }
        }
        // stage('React install') {
        //     steps {
        //         dir('c://Users/protype/projects/pobedit/frontend/') {
        //             powershell 'npm install'
        //         }
        //     }
        // }
        // stage('React build') {
        //     steps {
        //         dir('c://Users/protype/projects/pobedit/frontend/') {
        //             powershell '../deliver/deliver.ps1'

        //             // echo 'Starting build process...'
        //             // powershell 'npm run build'
        //             // echo 'Starting run process...'
        //             // powershell 'npm run dev'

        //             input message: 'Finished using the web site? (Click "Proceed" to continue)'
        //         // powershell './jenkins/scripts/kill.ps1'
        //         }
        //     }
        // }
        // stage('Build control service') {
        //     steps {
        //         dir('c://Users/protype/projects/pobedit/backend/services/ControlService/') {
        //             script {
        //                 // Build the .NET Core application
        //                 powershell 'dotnet build --configuration Release'
        //             }
        //         }
        //     }
        // }
        // stage('Publish control service') {
        //     steps {
        //         script {
        //             // Publish the .NET Core application
        //             powershell 'dotnet publish --configuration Release --output ./publish'
        //         }
        //     }
        // }
        // stage('Build Control Service Docker Image') {
        //     steps {
        //         script {
        //             // Build Docker image
        //             powershell "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
        //         }
        //     }
        // }
        // stage('Deploy Control Service') {
        //     steps {
        //         script {
        //             // Stop and remove the existing container if it exists
        //             powershell "docker stop ${DOCKER_IMAGE_NAME} || true"
        //             powershell "docker rm ${DOCKER_IMAGE_NAME} || true"
        //             // Run the Docker container with the newly built image
        //             powershell "docker run -d --name ${DOCKER_IMAGE_NAME} -p 8000:80 ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
        //         }
        //     }
        // }
        // post {
        //     always {
        //         // Clean up workspace
        //         cleanWs()
        //     }
        //     success {
        //         echo 'Pipeline completed successfully.'
        //     }
        //     failure {
        //         echo 'Pipeline failed.'
        //     }
        // }
    }
}
