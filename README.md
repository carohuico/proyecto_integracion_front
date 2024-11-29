# Proyecto final
# Arturo Daniel Melchor Aranda - 585292
# Carolina Huicochea Romo - 582950
# Eva María Solís Sánchez - 627264
# Paso a paso para replicación
Frontend
Con Github
Tener instalado lo siguiente en su computadora:
Ember CLI: npm install -g ember-cli
Git: https://git-scm.com/ 
Node.js: https://nodejs.org/ 
Visual Studio Code: https://code.visualstudio.com/ 
Obtener el enlace del repositorio: https://github.com/carohuico/proyecto_integracion_front.git 
Clonar el repositorio:
En Visual Studio Code abrir una terminal
Ir al directorio donde se quiera guardar el proyecto usando cd ruta/del/directorio.
Escribir el comando: git clone <URL_DEL_REPOSITORIO>
Navegar al directorio clonado con cd
Instalar las dependencias, como se usa Node.js, el comando es: npm install
Ejecutar el proyecto: ember s o npm start
Visita la URL especificada, como http://localhost:4200.

Con archivo comprimido
Tener instalado lo siguiente en su computadora:
Ember CLI: npm install -g ember-cli
Git: https://git-scm.com/ 
Node.js: https://nodejs.org/ 
Visual Studio Code: https://code.visualstudio.com/ 
Localizar el archivo comprimido.
Extraer el contenido en la ubicación deseada.
Instalar dependencias: npm install
Navegar a la carpeta del proyecto con cd
Instalar dependencias: 
Ejecutar el proyecto: ember s o npm start
	Backend
Prerrequisitos:
Datos de la cuenta de Google: 
correo: finalintegracioncea@gmail.com
contraseña: ProyectoFinalOt24.
Acceso a la VM: 
gcloud auth login

gcloud config set project proyecto-final-440821

gcloud compute ssh finalintegracioncea@proyecto-integracion-final --zone=us-central1-a
Base de datos Cloud SQL:
mysql -u root -p -h 34.136.73.133
Contraseña 444
Configuración de la VM:
gcloud auth login

gcloud config set project proyecto-final-440821

gcloud compute ssh finalintegracioncea@proyecto-integracion-final --zone=us-central1-a
Una vez estando dentro, acceder la carpeta de backend: cd backend
Correr el archivo main.py: python main.py
Finalmente los servicios se habrán desplegado.

# Damos nuestra palabra de que hemos realizado esta actividad con integridad académica