pipeline{
    agent any
     parameters {
        booleanParam(name: 'push', defaultValue: false, description: '推送镜像')
        string(name: 'version', defaultValue: 'v1.0', description: '推送镜像版本')
    }
    tools {
        nodejs 'node-10.23.0' 
    }
    stages{
        stage("build"){
            steps{
                //sh 'npm cache clean --force'
                sh 'npm install'
                sh 'npm run build:prod'
            }
           
        }
        stage("build images"){
            steps{
                sh 'docker build -t lanjerry-web .'
                sh 'docker tag lanjerry-web lanjerry-web:${version}'
            }
        }
        stage("run"){
            steps{
                sh 'docker-compose -f /opt/lanjerry/docker-compose-web.yml up -d'
            }
        }
        stage("push"){
            when {
                expression { return params.push } 
            }
             steps{
                sh 'docker tag lanjerry-web:${version} registry.cn-hangzhou.aliyuncs.com/nieqiurong/lanjerry-web:${version}'
                //sh 'docker push registry.cn-hangzhou.aliyuncs.com/nieqiurong/lanjerry-web'
                sh 'docker push registry.cn-hangzhou.aliyuncs.com/nieqiurong/lanjerry-web:${version}'
            }
        }
    }
}