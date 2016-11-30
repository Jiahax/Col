/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/knockout/knockout.d.ts" />
/// <reference path="appshared.ts" />
/// <reference path="models.d.ts" />

interface KnockoutBindingHandlers {
    selectPicker: KnockoutBindingHandler;
    htmlLazy: KnockoutBindingHandler;
    contentEditable: KnockoutBindingHandler;
    jsEditable: KnockoutBindingHandler;
    bootstrapPopover: KnockoutBindingHandler;
}
interface JQuery {
    selectpicker;
}
ko.bindingHandlers.selectPicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if ($(element).is('select')) {
            if (ko.isObservable(valueAccessor())) {
                if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                    // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                    ko.bindingHandlers.selectedOptions.init(element, valueAccessor, allBindingsAccessor);
                } else {
                    // regular select and observable so call the default value binding
                    ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor);
                }
            }
            $(element).addClass('selectpicker').selectpicker();
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        if ($(element).is('select')) {
            var selectPickerOptions = allBindingsAccessor().selectPickerOptions;
            if (typeof selectPickerOptions !== 'undefined' && selectPickerOptions !== null) {
                var options = selectPickerOptions.optionsArray,
                    optionsText = selectPickerOptions.optionsText,
                    optionsValue = selectPickerOptions.optionsValue,
                    optionsCaption = selectPickerOptions.optionsCaption,
                    isDisabled = selectPickerOptions.disabledCondition || false,
                    resetOnDisabled = selectPickerOptions.resetOnDisabled || false;
                if (ko.utils.unwrapObservable(options).length >= 0) {
                    // call the default Knockout options binding
                    ko.bindingHandlers.options.update(element, options, allBindingsAccessor);
                }
                if (isDisabled && resetOnDisabled) {
                    // the dropdown is disabled and we need to reset it to its first option
                    $(element).selectpicker('val', $(element).children('option:first').val());
                    
                }
                $(element).prop('disabled', isDisabled);
                $('.selectpicker[disabled]').parent().find(".dropdown-toggle").attr("disabled", "disabled");
            }
            if (ko.isObservable(valueAccessor())) {
                if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                    // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                    ko.bindingHandlers.selectedOptions.update(element, valueAccessor);
                } else {
                    // call the default Knockout value binding
                    ko.bindingHandlers.value.update(element, valueAccessor);
                }
            }

            $(element).selectpicker('refresh');
        }        
    }
};

ko.bindingHandlers.htmlLazy = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = ko.unwrap(valueAccessor()),
            contentEditable = allBindingsAccessor().contentEditable,
            jsEditable = allBindingsAccessor().jsEditable;
        if (!element.isContentEditable || jsEditable) {
            element.innerText = value;
            element.contentEditable = contentEditable;
        }
    }
};
ko.bindingHandlers.contentEditable = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var value = ko.unwrap(valueAccessor()),
            htmlLazy = allBindingsAccessor().htmlLazy,
            valueUpdate = allBindingsAccessor().valueUpdate;

        // Below code works on Chrome, but not for IE. So, Commentted.
        //$(element).on("input", function () {
        //    if (this.isContentEditable && ko.isWriteableObservable(htmlLazy)) {
        //        htmlLazy(this.innerHTML);
        //    }
        //});

        var eventList = "blur paste copy cut mouseup ";
        if (typeof (valueUpdate) != 'undefined') {
            eventList = eventList.concat(valueUpdate);
        }

        $(element).bind(eventList, function () {
            if (this.isContentEditable && ko.isWriteableObservable(htmlLazy)) {
                htmlLazy(this.innerText);
            }
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());

        //element.contentEditable = value;

        if (!element.isContentEditable) {
            $(element).trigger("input");
        }
    }
};

ko.bindingHandlers.bootstrapPopover = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var options = ko.utils.unwrapObservable(valueAccessor());
        var defaultOptions = {};
        options = $.extend(true, {}, defaultOptions, options);
        $(element).popover(options);
    }
};
