FROM nginx:1.19.4
LABEL maintainer="nieqiurong@163.com"
COPY dist/ /usr/share/nginx/html 
#COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY default.conf.template /etc/nginx/templates/default.conf.template
