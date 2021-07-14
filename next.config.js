isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '' : '';
//Para desarrollo
const rutas = isProd ? '' : 'http://172.16.117.11';
// const rutas = isProd ? '' : 'http://localhost:8080';
//Para QA
// const rutas = isProd ? '' : 'http://172.16.119.17';

module.exports = {
  basePath: basePath,
  env: {
    img: basePath,
    ruta: rutas
  }
}
