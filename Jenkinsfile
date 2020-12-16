pipeline{
    agent any
     parameters {
        booleanParam(name: 'package', defaultValue: true, description: '打包项目')
        booleanParam(name: 'push', defaultValue: false, description: '推送镜像')
        string(name: 'version', defaultValue: 'v1.0', description: '推送镜像版本')
    }
    tools {
        nodejs 'node15.4.0'
    }
    stages{
        stage("build"){
            when {
                expression { return params.package }
            }
            steps{
                //sh 'npm cache clean --force'
                sh 'npm install'
                sh 'npm run build:prod'
            }
        }
        stage("build images"){
            steps{
                sh 'docker build -t lanjerry-admin-web .'
                sh 'docker tag lanjerry-admin-web lanjerry-admin-web:${version}'
            }
        }
        stage("run"){
            steps{
                sh 'docker-compose -f docker-compose-web.yml up -d'
            }
        }
        stage("push"){
            when {
                expression { return params.push }
            }
             steps{
                sh 'docker tag lanjerry-admin-web:${version} registry.cn-shenzhen.aliyuncs.com/lanjerry/lanjerry-admin-web:${version}'
                sh 'docker push registry.cn-shenzhen.aliyuncs.com/lanjerry/lanjerry-admin-web:${version}'
            }
        }
    }
}
