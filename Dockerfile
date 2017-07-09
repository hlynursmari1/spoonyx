FROM ubuntu:16.04

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
        git \
        python \
        python-dev \
        python-setuptools \
        python-pip \
        nginx \
        supervisor \
        sqlite3 && \
    pip install -U pip setuptools && \
    rm -rf /var/lib/apt/lists/*

RUN pip install uwsgi

COPY restricted/requirements-base.txt /home/docker/code/restricted/
RUN pip install -r /home/docker/code/restricted/requirements-base.txt

COPY . /home/docker/code/

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY restricted/nginx.conf /etc/nginx/sites-enabled/spoonyx
COPY restricted/supervisord.conf /etc/supervisor/conf.d/

RUN /home/docker/code/manage.py collectstatic --noinput

EXPOSE 8000
CMD ["supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
