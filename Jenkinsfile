pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the repository
                git 'https://github.com/1155194577/CuCourseQueries.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Install npm dependencies
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                // Run the tests
                sh 'npm test'
            }
        }
        
        stage('Build') {
            steps {
                // Build the application if needed
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                // Deploy the application
                // This is a placeholder; replace it with your actual deployment command
                sh 'npm run dev'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
