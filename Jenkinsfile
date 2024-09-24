pipeline {
    agent any
    stages {
        stage('Build') { 
            steps {
                dir('../frontend') {
                    powershell 'npm install' 
                }
            }
        }
    }
}
