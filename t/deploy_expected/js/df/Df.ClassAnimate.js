Df.ClassAnimator=Class.create({initialize:function(element,selector,pars){this.selector=selector;this.CSSClassNameConversionTable={width:'width',height:'height',color:'color',left:'left',top:'top',fontsize:'fontSize',lineheight:'lineHeight',letterspacing:'letterSpacing',paddingleft:'paddingLeft',paddingright:'paddingRight',paddingtop:'paddingTop',paddingbottom:'paddingBottom',marginleft:'marginLeft',marginright:'marginRight',margintop:'marginTop',marginbottom:'marginBottom',opacity:'opacity',backgroundcolor:'backgroundColor',backgroundposition:'backgroundPosition'}
this.pars=this._getCSSPars(this.selector);if(pars){this.setPars(pars);}
this.animate=new Df.Animate(element,this.pars);},_getCSSPars:function(){var pars={};var obj=this;var sheets=document.styleSheets;$A(sheets).each(function(sheet,index){var rules=sheet.rules?sheet.rules:sheet.cssRules;$A(rules).each(function(rule,index){if(rule.selectorText==obj.selector){for(property in obj.CSSClassNameConversionTable){var val=rule.style[obj.CSSClassNameConversionTable[property]];if(val){pars[obj.CSSClassNameConversionTable[property]]=val;}}}});});return pars;},setPars:function(pars){Object.extend(this.pars,pars);},run:function(){this.animate.run();},toggle:function(){this.animate.toggle();}});