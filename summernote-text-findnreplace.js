(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }
}(function ($) {
    $.extend($.summernote.options, {
        findnreplace: {
            classHidden: 'note-display-none',
            icon:      '<i class="fas fa-search"></i>'
        }
    });
    $.extend($.summernote.plugins, {
        'findnreplace': function (context) {
            var ui       = $.summernote.ui,
                $note    = context.layoutInfo.note,
                $editor  = context.layoutInfo.editor,
                $toolbar = context.layoutInfo.toolbar,
                options  = context.options,
                lang     = options.langInfo,
                interface = $.summernote.interface;
            context.memo('button.findnreplace', function() {
                var button = ui.button({
                    contents: options.findnreplace.icon,
                    container: options.container,
                    tooltip:  lang.findnreplace.tooltip,
                    placement: options.placement,
                    className:'hide-icons-toolbar',
                    click: function (e) {
                        e.preventDefault();
                        $editor.find('.note-findnreplace').contents().unwrap('mark');
                        $('#findnreplaceToolbar').toggleClass(options.findnreplace.classHidden);
                        $('.note-status-output').text('');
                        if ($note.summernote('createRange').toString()) {
                            var selected = $note.summernote('createRange').toString();
                            $('#note-findnreplace-find').val(selected);
                        }
                    }
                });
                return button.render();
            });
            this.initialize = function () {
                var fnrBody =
                    '<div id="findnreplaceToolbar" class="note-display-none">' +
                    '<div class="note-form-group">' +
                    '<input id="note-findnreplace-find" type="text" class="note-findnreplace-find note-input" value="" placeholder="' + lang.findnreplace.findPlaceholder + '">' +
                    '<button class="note-findnreplace-find-btn note-btn btn btn-light btn-sm">' + lang.findnreplace.findBtn + '</button>' +
                    '</div>' +
                    '<div class="note-form-group">' +
                    '<input id="note-findnreplace-replace" type="text" class="note-findnreplace-replace note-input" value="" placeholder="' + lang.findnreplace.replacePlaceholder + '">' +
                    '<button class="note-findnreplace-replace-btn btn btn-default note-btn btn btn-light btn-sm">' + lang.findnreplace.replaceBtn + '</button>' +
                    '</div>' +
                    '</div>';
                $('.note-toolbar').append(fnrBody);
                this.show();
            };
            this.findnreplace = function() {
                var $fnrFindBtn    = $('.note-findnreplace-find-btn');
                var $fnrReplaceBtn = $('.note-findnreplace-replace-btn');
                $fnrFindBtn.click(function (e) {
                    e.preventDefault();
                    $editor.find('.note-findnreplace').contents().unwrap('mark');
                    var fnrCode    = context.invoke('code');
                    var fnrFind    = $('.note-findnreplace-find').val();
                    var fnrReplace = $('.note-findnreplace-replace').val();
                    var fnrCount   = (fnrCode.match(new RegExp(fnrFind + "(?![^<>]*>)", "gi")) || []).length
                    if (fnrFind) {
                        $('.note-status-output').text(fnrCount + lang.findnreplace.findResult + "`" + fnrFind + "`");
                        var fnrReplaced = fnrCode.replace(new RegExp(fnrFind + "(?![^<>]*>)", "gi"), function(e){return '<mark class="note-findnreplace">' + e + '</mark>';});
                        $note.summernote('code',fnrReplaced);
                    } else
                        $('.note-status-output').html(lang.findnreplace.findError);
                });
                $fnrReplaceBtn.click(function (e) {
                    e.preventDefault();
                    $editor.find('.note-findnreplace').contents().unwrap('mark');
                    var fnrCode    = context.invoke('code');
                    var fnrFind    = $('.note-findnreplace-find').val();
                    var fnrReplace = $('.note-findnreplace-replace').val();
                    var fnrCount   = (fnrCode.match(new RegExp(fnrFind, "gi")) || []).length
                    if (fnrFind) {
                        $('.note-status-output').text(fnrCount + lang.findnreplace.findResult + "`" + fnrFind + "`" + lang.findnreplace.replaceResult +"`" + fnrReplace + "`");
                        var fnrReplaced = fnrCode.replace(new RegExp(fnrFind + "(?![^<>]*>)", "gi"), fnrReplace);
                        $note.summernote('code', fnrReplaced);
                    } else {
                        if (fnrReplace) {
                            if ($note.summernote('createRange').toString()) {
                                $note.summernote('insertText',fnrReplace);
                                $('.note-status-output').text('');
                            } else
                                $('.note-status-output').html(lang.findnreplace.noneSelected);
                        } else
                            $('.note-status-output').html(lang.findnreplace.replaceError);
                    }
                });
            };
            this.show = function() {
                this.findnreplace();
            };
        }
    });
}));
