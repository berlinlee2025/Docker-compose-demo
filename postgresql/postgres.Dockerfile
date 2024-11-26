FROM postgres

ARG TIME_ZONE=Asia/Shanghai
# Set environment variables for APT
ENV TZ=$TIME_ZONE
ENV LANG=C.UTF-8
ENV DEBIAN_FRONTEND=non-interactive

# Environment variables can be set directly in the Dockerfile
# if constant values are needed
# ENV POSTGRES_USER=postgres
# ENV POSTGRES_PASSWORD=rootGor
# ENV POSTGRES_DB=smart-brain

COPY ./postgres-init/init.sql /docker-entrypoint-initdb.d/

# Set Container Linux env USER to ROOT
USER root

# Define build-time argument for hostname (optional)
ARG DEFAULT_HOSTNAME=ai-postgres

# Use the hostname in some configuration file or script
#RUN echo "Hostname of this Container: ${DEFAULT_HOSTNAME}" > /hostname_info.txt
RUN echo ${DEFAULT_HOSTNAME}

# Updating Debian repository
RUN apt-get update && apt -y upgrade

# Install Tools
# To allow troubleshooting inter-containers communication
# e.g. goals-backend ping mongodb
# docker exec -it goals-backend ping -c 2 mongodb;

#RUN apt-get update && apt-cache search net-tools && \
RUN apt-get install -y inetutils-tools
RUN apt-get install -y iputils-ping
RUN apt-get install -y net-tools
RUN apt-get install -y telnet 
RUN apt-get install -y netcat-traditional
RUN apt-get install -y coreutils
# busybox cat /app/hostname.txt
RUN apt-get install -y busybox

# Clean up APT when done
# RUN apt-get clean && \
# rm -rf /var/lib/apt/lists/*
RUN apt-get clean

###