<template>
  <div v-if="!drawerOpen" v-html="html" class="markdown-body" style="background-color: hsla(240, 53%, 93%, 0);"></div>
</template>

<script setup>
import 'github-markdown-css/github-markdown-light.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import MarkdownIt from 'markdown-it'
import { ref, watch } from 'vue'

const props = defineProps({
  markdown: { type: String, required: true },
  drawerOpen: { type: Boolean, default: false }
})

function replaceYoutubeLinksWithEmbed(md) {
  return md.replace(
    /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)[^\s]*)/g,
    (full, url, id) => {
      return `<div class="youtube-embed">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>
      </div>`
    }
  )
}

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch (__) { }
    }
    return `<pre class="hljs"><code>${mdParser.utils.escapeHtml(str)}</code></pre>`;
  }
})

const html = ref(
  mdParser.render(replaceYoutubeLinksWithEmbed(props.markdown.replace(/\r/g, '\n')))
)

watch(() => props.markdown, (newVal) => {
  html.value = mdParser.render(replaceYoutubeLinksWithEmbed(newVal.replace(/\r/g, '\n')))
})
</script>

<style>
.youtube-embed {
  margin: 1.5em 0;
  max-width: 560px;
  border-radius: 12px;
  box-shadow: 0 2px 12px #0001;
  overflow: hidden;
}

.youtube-embed iframe {
  display: block;
  width: 100%;
  min-height: 315px;
  border: none;
  background: #111;
}
</style>