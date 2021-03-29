isProd = process.env.ENV == 'PRODUCTION';
const basePath = isProd ? '' : '';
const rutas = isProd ? 'https://situ.sedatu.gob.mx' : 'http://172.16.117.11';

module.exports = {
  basePath: basePath,
  env: {
    img: basePath,
    ruta: rutas,
    env: 'DEVELOPMENT'
  }
}