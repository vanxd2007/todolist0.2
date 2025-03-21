# Usamos una imagen base de MySQL
FROM mysql:8.0

# Definimos variables de entorno para la configuración de MySQL
ENV MYSQL_DATABASE=mydatabase
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_USER=myuser
ENV MYSQL_PASSWORD=mypassword

# Copiamos el script SQL de inicialización al contenedor
COPY ./init.sql /docker-entrypoint-initdb.d/

# Exponemos el puerto 3306
EXPOSE 3306
