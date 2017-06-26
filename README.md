# nust-generator-sitemap
Common sitemap generator for Nust, also support baidu search engine.

## Usage

In the project root of your nust theme,

```
npm i nust-generator-sitemap -S
// or `yarn add nust-generator-sitemap`
```

Put the settings in `path-to-your-theme/configs/nust.js` as below,

```
module.exports = {
  // sitemap
  sitemap: {
    common: {
      // use standard sitemap, while the other option is `sitemap-baidu` for China users.
      type: 'sitemap',
      // If there are no posts written in current language, Nust will use the posts written with the default language
      use_default_posts: true
    }
  }
}
```

If you omit the settings in `nust.js`, Nust will use the above default settings.

If you wanna configure different sitemap for different languages, it's done like,

```
module.exports = {
  // sitemap
  sitemap: {
    en: {
      type: 'sitemap',
      use_default_posts: true
    },
    'zh-CN': {
      type: 'sitemap-baidu'
    }
  }
}
```
