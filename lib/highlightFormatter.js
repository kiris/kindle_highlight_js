var highlightFormatter = function() {
  var util = require('./util'),
      Highlight,
      ua = navigator.userAgent;

  if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
    Highlight = require('./highlight_sp');
  } else {
    Highlight = require('./highlight');
  }

  util.defineInnerTextForFirefox();

  this.highlight = new Highlight(document);
  this.highlight_markdown = [];
};

highlightFormatter.prototype.output = function(option) {
  if (option == null) {
    option = {};
  }
  this.outputBookInfo();
  this.outputHighlightInfo(option);
  this.outputExecute();
};
highlightFormatter.prototype.outputExecute = function() {

  document.title = this.highlight.getTitle();
  document.body.removeAttribute('class');
  document.body.style.fontFamily = 'arial,sans-serif';
  document.body.style.fontSize = '.75em';
  document.body.style.color = '#333';
  document.body.style.lineHeight = '1.5em';


  var element = document.createElement("textarea");
  element.value =  this.highlight_markdown.join('\n');
  element.style.height = '100%';

  document.body.innerHTML = "";
  document.body.appendChild(element);
};

highlightFormatter.prototype.outputBookInfo = function() {
  this.highlight_markdown.push('# 概要');
  this.highlight_markdown.push('* *タイトル:* ' + this.highlight.getTitle());
  this.highlight_markdown.push('* *著者:* ' + this.highlight.getAuthor());
  this.highlight_markdown.push('* *ASIN:* ' + this.highlight.getAsin());
  this.highlight_markdown.push('');
  this.highlight_markdown.push('[商品ページ](http://www.amazon.co.jp/dp/' + this.highlight.getAsin() + ')');
  this.highlight_markdown.push('');
};

highlightFormatter.prototype.outputHighlightInfo = function(option) {
  var i = 0, len = this.highlight.getHighlightLength();

  this.highlight_markdown.push('# ハイライト');
  this.highlight_markdown.push('');
  for(; i < len; i++) {
    var highlight = this.highlight.getHighlightTags()[i];
    if (!highlight) {
      continue;
    }
    this.highlight_markdown.push('## ' + highlight.innerText.substring(0, 16));
    this.highlight_markdown.push('');
    this.highlight_markdown.push('```');
    this.highlight_markdown.push(highlight.innerText);
    this.highlight_markdown.push('```');
    if (option.with_location === true) {
      var locationTag = this.highlight.getLocationTags()[i];
      var locationNo = locationTag.innerText.match(/\d+(,?)(\d+)?/)[0].replace(/,/, '');
      this.highlight_markdown.push('[Read more at location ' + locationNo + '](kindle://book?action=open&asin=' + this.highlight.getAsin() + '&location=' + locationNo + ')');
    }
    this.highlight_markdown.push('');
  }
};

module.exports = highlightFormatter;
