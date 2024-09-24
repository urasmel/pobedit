pipeline {
    agent any
    stages {
        stage('Build') { 
            steps {
                cd ../frontend/
                powershell 'npm install' 
            }
        }
    }
}
