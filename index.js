const nunjucks = require('nunjucks')
const env = new nunjucks.Environment()
const pathFn = require('path')
const fs = require('fs')
const {URL} = require('url')

env.addFilter('uriencode', (str) => {
  return encodeURI(str)
})

const tmplSrc1 = pathFn.join(__dirname, 'sitemap.xml')
const tmplSrc2 = pathFn.join(__dirname, 'sitemap-baidu.xml')
const tpls = {
  'sitemap': nunjucks.compile(fs.readFileSync(tmplSrc1, 'utf8'), env),
  'sitemap-baidu': nunjucks.compile(fs.readFileSync(tmplSrc2, 'utf8'), env)
}

/**
 * generator for sitemap
 */
module.exports = function (data) {
  let pluginConfigs = data.appConfigs.sitemap
  if (pluginConfigs === false) return false
  let postData = data.data.posts0
  let ret = []
  pluginConfigs = pluginConfigs || {common: {type: 'sitemap', use_default_posts: true}}
  Object.keys(pluginConfigs).forEach(key => {
    let configs = pluginConfigs[key]
    let type = configs.type || 'sitemap'
    let tpl = tpls[type] || tpls['sitemap']
    let posts = postData[key]
    if ((!posts || posts.length === 0) && configs.use_default_posts) {
      posts = postData[data.appConfigs.lang] || []
    }

    posts = posts.filter(post => {
      return post.draft !== true
    })

    if (configs.limit) posts = posts.slice(0, configs.limit - 1)

    configs.posts = posts
    configs.lastUpdated = posts[0] ? posts[0].updatedISO : new Date().toISOString()
    configs.urlRoot = data.appConfigs.url
    configs.author = data.appAuthor
    if (typeof configs.author === 'string') {
      configs.author = {
        name: configs.author
      }
    }
    let targetFile = pathFn.join(this.dirTheme, `static/${type}.xml`)
    configs.url = new URL(`${type}.xml`, configs.urlRoot).toString()

    ret.push({
      path: targetFile,
      data: tpl.render(configs)
    })
  })
  return ret
}
