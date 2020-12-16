FROM nginx
LABEL maintainer="38046851@qq.com"
COPY dist/ /usr/share/nginx/html
COPY default.conf.template /etc/nginx/templates/default.conf.template
