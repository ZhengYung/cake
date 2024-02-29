FROM php:7.4-apache
# 安裝所需的軟體包
# RUN apt-get update
# RUN apt-get install --yes --force-yes cron g++ gettext libicu-dev openssl libc-client-dev libkrb5-dev libxml2-dev libfreetype6-dev libgd-dev libmcrypt-dev bzip2 libbz2-dev libtidy-dev libcurl4-openssl-dev libz-dev libmemcached-dev libxslt-dev
#兩行整合如下
RUN apt-get update && apt-get install -y \
    cron g++ gettext libicu-dev openssl libc-client-dev libkrb5-dev \
    libxml2-dev libfreetype6-dev libgd-dev libmcrypt-dev bzip2 libbz2-dev \
    libtidy-dev libcurl4-openssl-dev libz-dev libmemcached-dev libxslt-dev

# 啟用 Apache 的 rewrite 模組
RUN a2enmod rewrite

# 安裝 mysqli 擴展
# RUN docker-php-ext-install mysqli 
# RUN docker-php-ext-enable mysqli
#兩行整合如下
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# 安裝 gd 擴展
# RUN docker-php-ext-configure gd --with-freetype=/usr --with-jpeg=/usr
# RUN docker-php-ext-install gd
#兩行整合如下
RUN docker-php-ext-configure gd --with-freetype=/usr --with-jpeg=/usr && \
    docker-php-ext-install gd

