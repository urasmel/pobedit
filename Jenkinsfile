pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                dir('c://Users/protype/projects/pobedit/frontend/') {
                    powershell 'npm install'
                }
            }
        }
        stage('Deliver') {
            steps {
                dir('c://Users/protype/projects/pobedit/frontend/') {
                    // powershell '../deliver/deliver.ps1'

                    echo 'Starting build process...'
                    powershell 'npm run build' - wait
                    echo 'Starting run process...'
                    powershell 'npm run dev'

                    input message: 'Finished using the web site? (Click "Proceed" to continue)'
                // powershell './jenkins/scripts/kill.ps1'
                }
            }
        }
    }
}
