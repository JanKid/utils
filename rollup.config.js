export default {
    entry: 'src/index.js',
    format: 'umd',
    moduleName: 'utils', //umd或iife模式下，若入口文件含 export，必须加上该属性
    dest: './dist/utils.js',
    sourceMap: true
}