/*
 * ModalDialog 2.0 - Modal pop up boxes made easy!
 * Version 2.0
 * @requires jQuery v1.11.0+
 *
 * Copyright (c) 2016 Michael Truka
 * @type jQuery
 * @name ModalDialog
 * @cat Plugins/Modal
 * @author Michael Truka
 * test test test
 */

(function($) {
  var shadowLayerCreated = false;
  var shadowLayerOpen = false;
  var focusEventAttached = false;
  var $shadowLayer = $('<div></div>');
  var dialogList = [];
  var presetCss = { //Styles that can not change in order for everything to work smoothly 
    modal: {
      css: {
        'margin': '0 auto',
        'display': 'inline-block',
        'overflow': 'hidden',
        'box-sizing': 'border-box'
      },
      positionCss: {
        'position': 'fixed',
        'width': '100%',
        'left': '0',
        'overflow': 'auto',
        'box-sizing': 'border-box'
      }
    },
    shadow: {
      css: {
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%',
        'box-sizing': 'border-box'
      }
    },
    header: {
      css: {
        'position': 'relative'
      }
    },
    hiddenFocusLink: {
      css: {
        'height': '0',
        'opacity': '0',
        'display': '0',
        'font-size': '1px',
        'padding': '0',
        'margin': '0'
      }
    }
  };

  var modal = $.modalDialog = new function() {
    this.defaults = {
      modal: {
        css: {
          'background-color': '#F2F2F2',
          'border': '1px solid #444444',
          'border-radius': '5px',
          'box-shadow': '2px 2px 5px #333333'
        },
        positionCss: {
          'top': '10%',
          'text-align': 'center',
          'z-index': '1001',
          'bottom': '10%'
        }
      },
      shadow: {
        css: {
          'background-color': '#404040',
          'opacity': '.75',
          'z-index': '1000'
        },
        fadeIn: true
      },
      header: {
        css: {
          'background-color': '#C4C4C4',
          'box-shadow': 'inset 0 -20px 15px #EAEAEA',
          'border-bottom': '1px solid #ADADAD',
          'color': 'black',
          'text-shadow': 'none',
          'font-weight': 'bold',
          'text-align': 'center',
          'padding': '3px',
          'font-size': '1.2em',
          'min-height': '23px'
        },
        text: '',
        show: true,
        showCloseButton: true,
        closeIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGnRFWHRTb2Z0d2FyZQBQYWludC5ORVQgdjMuNS4xMDD0cqEAAAUUSURBVEhLvZR5UJRlHMf33ZUjYbndxYVdLkNuUGiVxoPA4RBYEO9rWUQOXU5RO5zMqdG0qShJEUNJURTJGO4QGR1TQJRT5AZzHKO0KDFFcHe//d41aRw1+6tn5jvvNc/n+f6+z+99OJz/e2yTWE76ZLq9bY6Px1tHfb0TTrzp884pX5+MQqlXRL6bo9s+GxE/TWDG/Gdf74osmN2OdtYHvD021MhCrjatWTbcG68YG0iMVfXHK1Tt8hWPfogIuX1SOqMwy0Eyf4fQXP+V8O3WQl6Wu9O8qtDAC9fjosdvb07BLdKPGSkY3JSM/jQl+lMSMZAUj744Bc6HLBg54uaYLTN8zeSl8F0SS162h5P0THhwY19SgvrmljTc2JKKgYxk9KUr0ZOyAV1JCejYsB7tCTFoi4tGm2IV6mQh6s0iQUmcmbHwhfBs52m25UH+lf2pGzU3CDpALnvSNqKLgJ3KeHQkxmqBzbFyNCpWo1G+EvWrl6Fh1VJUzfdVJ1laHDTjck2fg5+eI93SvD76PgvsTU9CNwGv781Ef14u2slpy3o5rsasweXt29CRdwh1FMWFZYtwfkkEzsmCsc/l9VFHPZ14AvMm4LtEAm5tWFBLT1qShoV2Jieibft7+H1oCGMj93CjIB+X4xW4lJGKob4+jD14gN6ik6hdGoGzi0JxJiIEZfNmw58/uZnL4VhNgI+KheIra1eoeijTTtqga1R6G8Vxr7cbGpUKjx8+xM3asxjq7oIGwOjwb2j+4jNUR4WjOmIhKmUEDglAjMBsVJ/hRBKY+DRKxAJ/Fta5NR3XyHErld6UuA5tH2zD3eYmaNRqqB8/1l4f3PkFrfuzUL08ClWLwlAZGYpyUll4EFLFU9WTGc5uQuppwbUSgawjlZxu3YTW9GQ0URRXaPfrqPwWgoyPjpLPJ+PWpYuoWSdHFWVbsViG8sXhKI0KQwnFkWJjBXJ8jJB8LfiiRDC7LXYtWjenoon69QptXIMyDldp8+4ODmidqsbGtLGw+XaXFKOKOqN8aSRKaYESAhdRFHKhBXQ5nFOENNaCKyRC08ZAv4d11EKsyzrWLcUwPPQT1GoVlX8HHceOat2yi4xT5q30XEybdzosCMfnzkKO+3T4GehrKNzcCcduejpMvdSztjYsEDVUUnXkQtTERmOY3N6nzmjYswsV1FoV8lW4WX8Jf/56F+d3fogjvt447OWCgy7TsFNsCSsed5ygb09kzLqud3VYXjx7xmh5oB9KF8xDsf8cVBLo+4R1KKRWKvCdiWNSLxQEB+A7xRoc8nbXAg842SHT3hqRRgbQ4XB+JtT8Z3r5nJ3I/Gt766qiNzw131JpRXOlOEGOjhMs38cDR2a6Is/TGblujshxdiCgPfY72uIrBzGU5kYQPXGbR7Ig/XPqJZoYMkpTvuvHVoKuXJqQ5+FEMDd8M8MVhz2dtEDWYfZ0OwLaIMveCp9aT8Emggp5DIjUQkB/0qSJH+TpjbeeLnelkYGP0ty4Y6fIQpMpscSXtiJkOVhjL4HY+8/FQuyZao73pxhjCV8fYh5XTfMHSQGkyc9Bn74w53K57rqTXGbp6xasNjK4l2bG1+ywMMJHpB3kLtnEEIsN9eGqw9MYMJw/aF4pKZzEnsuvPPgZanRTPsMEGTJMvjGXuWbEZUboeZzeP6JaB4lQRqCNpGnPdMFLLT/7gf3nDUjsWcsCXEjOJBuS2d/AV7r8t7XYyS/SS+f8BfkQtHBvgqhmAAAAAElFTkSuQmCC'
      },
      slideSpeed: 200,
      startOpen: false, //Not Overwritable
      debug: false,
      postOpen: function() {}, //Not Overwritable
      postClose: function() {} //Not Overwritable
    };

    function openModalDialog(e, overwriteSettings) {
      e.stopPropagation();
      e.preventDefault();
      var pop = this;
      var $pop = $(pop);
      var c = pop.config;
      var oc = {};
      $.extend(true, oc, c, overwriteSettings);

      if (!c.isOpen) {
        $('body').css('overflow', 'hidden');
        if (oc.header.show) {
          pop.$header.find('span').text(oc.header.text);
          pop.$header.css(oc.header.css).show();

          if (oc.header.showCloseButton) {
            pop.$closeButton.show().find('img').attr('src', oc.header.closeIcon);
            pop.$header.css({
              'padding-right': '29px'
            });
          } else {
            pop.$closeButton.hide();
          }
        } else {
          pop.$header.hide();
        }

        if (!shadowLayerOpen) {
          $shadowLayer.css(oc.shadow.css);
          oc.shadow.fadeIn ? $shadowLayer.stop().fadeIn(100, openModal) : $shadowLayer.show(0, openModal);
          shadowLayerOpen = true;
        } else {
          openModal();
        }
      }

      function openModal() {
        $('*').blur();
        $(pop.dialog).css(oc.modal.css);

        $pop.css(oc.modal.positionCss).slideDown(oc.slideSpeed, postOpen);
        pop.scrollTop = 0;
        pop.isOpen = true;

        function postOpen() {
          c.postOpen.call(this);
          if (oc.callBack === "function") {
            oc.callBack.call(this);
          }

          setTimeout(function() {
            if (!focusEventAttached) {
              $('*').on('focus.modalScope', focusOnDialog);
              focusEventAttached = true;
              log('Focuse Event Attached', c);
            }
          }, 100);
        }

        function focusOnDialog(e) {
          var elemFound = false;
          var $pop, pop;
          for (var i = 0; i < dialogList.length; i++) {
            if (dialogList[i].isOpen) {
              firstOpenIndex = i;
              pop = dialogList[i];
              $pop = $(pop);
              if ($pop.is($(e.target)) || $pop.has($(e.target)).length > 0) {
                elemFound = true;
                log('Element Inside of Modal', pop.config);
              }
            }
          }

          if (elemFound) {
            return;
          }
          
          if (typeof pop === 'undefined' || typeof $pop === 'undefined') {
            return;
          }

          e.stopPropagation();
          try {
            log('Forcing focus back on modal window', pop.config);
          } catch (e) {}
          var fcsElem = $pop.find('a, input, select, textarea, button').filter(function() {
            return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none' || !$(this).is(':visible'));
          });

          switch (fcsElem.length) {
            case 0:
              $pop.prepend($('<a href="#" class="hidFocusElemPop" onclick="return false;">i</a>').css(presetCss.hiddenFocusLink.css));
              $(".hidFocusElemPop").focus();
              break;
            default:
              fcsElem.first().focus();
              if (fcsElem.length > 1) {
                $('.hidFocusElemPop').remove();
              }
              break;
          }
        }
      }
    }

    function closeModalDialog(e, overwriteSettings) {
      e.stopPropagation();
      e.preventDefault();
      var pop = this;
      var c = pop.config;
      var oc = {};
      $.extend(true, oc, c, overwriteSettings);
      if (pop.isOpen) {
        pop.isOpen = false;
        $(pop).slideUp(oc.slideSpeed, closeModal);
      }

      function closeModal() {
        var modalsOpen = 0;
        for (var i = 0; i < dialogList.length; i++) {
          if (dialogList[i].isOpen) {
            modalsOpen++;
          }
        }
        if (shadowLayerOpen && modalsOpen === 0) {
          oc.shadow.fadeIn ? $shadowLayer.stop().fadeOut(100) : $shadowLayer.hide();
          $('body').css('overflow', 'visible');
          $('*').off('focus.modalScope');
          focusEventAttached = false;
          log('Focus event detached', c);
          shadowLayerOpen = false;
        }
        c.postClose.call(this);
        if (typeof oc.callBack === "function") {
          oc.callBack.call(this);
        }
      }
    }

    function log(msg, c) {
      if (c.debug) {
        console.log(msg);
      }
    }

    this.log = log;

    this.setup = function(passElem, c) {
      var $pop;

      if (passElem.nodeName !== 'DIV') { //Ensures that a div is used.
        if (passElem.wrapperCreated) {
          pop = $(passElem).parent()[0];
        } else {
          pop = $(passElem).wrapAll('<div></div>').parent()[0];
          modal.log("Popup wrapped in div", c);
          passElem.wrapperCreated = true;
        }
      } else {
        pop = passElem;
      }

      if (!pop.hasPositionWrapper) {
        var positionWrapper = $(pop).wrapAll('<div></div>').parent()[0];
        positionWrapper.dialog = pop;
        pop = positionWrapper;
        log('Popup wrapped in position div', c);
        pop.hasPositionWrapper = true;
      }

      if (pop.hasInitialized) {
        modal.log("Instance of modal dialog already exists", c);
        return;
      }

      pop.hasInitialized = false;
      pop.config = c;
      //Prevents overwritting critical styles
      $.extend(true, pop.config.modal.css, pop.config.modal.css, presetCss.modal.css);
      $.extend(pop.config.modal.positionCss, pop.config.modal.positionCss, presetCss.modal.positionCss);
      $.extend(true, pop.config.shadow.css, pop.config.shadow.css, presetCss.shadow.css);
      $.extend(true, pop.config.header.css, pop.config.header.css, presetCss.header.css);
      $pop = $(pop);

      pop.$header = $('<div><span></span></div>');
      $(pop.dialog).prepend(pop.$header);

      pop.$closeButton = $('<a href="#" onClick="return false;"><img style="border:none;" src="' + c.header.closeIcon + '" alt="close" /></a>').css({
        'position': 'absolute',
        'top': '3px',
        'right': '3px',
        'cursor': 'pointer',
        'border': 'none'
      });
      pop.$closeButton.click(function() {
        $pop.trigger('closeModal');
      });
      pop.$header.append(pop.$closeButton);

      $pop.on('openModal', openModalDialog)
        .on('closeModal', closeModalDialog);

      if (pop.config.startOpen) {
        $pop.trigger('openModal');
      } else {
        $pop.hide();
        pop.isOpen = false;
      }
      dialogList.push(pop);
      pop.hasInitialized = true;
    };
  };

  $.fn.modalDialog = function(settings) {
    if (!shadowLayerCreated) {
      //Create shadowLayer as property that can be accessed
      $('body').append($shadowLayer);
      shadowLayerCreated = true;
    }
    return this.each(function() {
      var c, pop;
      c = {};
      $.extend(true, c, modal.defaults, settings);
      modal.setup(this, c);
    });
  };
})(jQuery);
