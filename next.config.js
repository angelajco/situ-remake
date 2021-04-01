isProd = process.env.NODE_ENV == 'production';
const basePath = isProd ? '' : '';
const rutas = isProd ? '' : 'http://172.16.117.11';

module.exports = {
  basePath: basePath,
  env: {
    img: basePath,
    ruta: rutas
  }
}