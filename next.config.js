isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '' : '';
//Para desarrollo
const rutas = isProd ? '' : 'http://172.16.117.11';
//Para QA
// const rutas = isProd ? '' : 'http://172.16.119.17';

module.exports = {
  basePath: basePath,
  env: {
    img: basePath,
    ruta: rutas
  }
}
