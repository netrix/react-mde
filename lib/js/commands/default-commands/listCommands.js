"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkedListCommand = exports.orderedListCommand = exports.unorderedListCommand = exports.makeList = exports.insertBeforeEachLine = void 0;
var MarkdownUtil_1 = require("../../util/MarkdownUtil");
/**
 * Inserts insertionString before each line
 */
function insertBeforeEachLine(selectedText, insertBefore) {
    var lines = selectedText.split(/\n/);
    var insertionLength = 0;
    var modifiedText = lines
        .map(function (item, index) {
        if (typeof insertBefore === "string") {
            insertionLength += insertBefore.length;
            return insertBefore + item;
        }
        else if (typeof insertBefore === "function") {
            var insertionResult = insertBefore(item, index);
            insertionLength += insertionResult.length;
            return insertBefore(item, index) + item;
        }
        throw Error("insertion is expected to be either a string or a function");
    })
        .join("\n");
    return { modifiedText: modifiedText, insertionLength: insertionLength };
}
exports.insertBeforeEachLine = insertBeforeEachLine;
var makeList = function (state0, api, insertBefore) {
    // Adjust the selection to encompass the whole word if the caret is inside one
    var newSelectionRange = (0, MarkdownUtil_1.selectWord)({
        text: state0.text,
        selection: state0.selection
    });
    var state1 = api.setSelectionRange(newSelectionRange);
    var breaksBeforeCount = (0, MarkdownUtil_1.getBreaksNeededForEmptyLineBefore)(state1.text, state1.selection.start);
    var breaksBefore = Array(breaksBeforeCount + 1).join("\n");
    var breaksAfterCount = (0, MarkdownUtil_1.getBreaksNeededForEmptyLineAfter)(state1.text, state1.selection.end);
    var breaksAfter = Array(breaksAfterCount + 1).join("\n");
    var modifiedText = insertBeforeEachLine(state1.selectedText, insertBefore);
    api.replaceSelection("".concat(breaksBefore).concat(modifiedText.modifiedText).concat(breaksAfter));
    // Specifically when the text has only one line, we can exclude the "- ", for example, from the selection
    var oneLinerOffset = state1.selectedText.indexOf("\n") === -1 ? modifiedText.insertionLength : 0;
    var selectionStart = state1.selection.start + breaksBeforeCount + oneLinerOffset;
    var selectionEnd = selectionStart + modifiedText.modifiedText.length - oneLinerOffset;
    // Adjust the selection to not contain the **
    api.setSelectionRange({
        start: selectionStart,
        end: selectionEnd
    });
};
exports.makeList = makeList;
exports.unorderedListCommand = {
    buttonProps: { "aria-label": "Add unordered list" },
    execute: function (_a) {
        var initialState = _a.initialState, textApi = _a.textApi;
        (0, exports.makeList)(initialState, textApi, "- ");
    }
};
exports.orderedListCommand = {
    buttonProps: { "aria-label": "Add ordered list" },
    execute: function (_a) {
        var initialState = _a.initialState, textApi = _a.textApi;
        (0, exports.makeList)(initialState, textApi, function (item, index) { return "".concat(index + 1, ". "); });
    }
};
exports.checkedListCommand = {
    buttonProps: { "aria-label": "Add checked list" },
    execute: function (_a) {
        var initialState = _a.initialState, textApi = _a.textApi;
        (0, exports.makeList)(initialState, textApi, function (item, index) { return "- [ ] "; });
    }
};
