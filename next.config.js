isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '' : '';

module.exports = {
    basePath: basePath,
    env: {
        img: basePath,
      },
}