"use strict";

var converter = new Showdown.converter();
var objFiles;

function processTheFiles() {

    var fileNameNoExt;
    var fileExt;
    var arrFilesProcessed = [];
    var targetResult;

    for (var i = 0, f; f = objFiles[i]; i++) {

        var reader = new FileReader();

        fileNameNoExt = f.name.substr(0, f.name.lastIndexOf('.')) || 'no-ext';
        fileExt = f.name.substr(f.name.lastIndexOf('.') + 1, f.name.length) || 'no-ext';

        arrFilesProcessed.push(fileNameNoExt);

        // Closure to capture the file information.
        reader.onload = (function (f) {
            return function (e) {
                targetResult = e.target.result;
            };
        })(f);

        reader.onloadend = function (e) {
            if (e.target.readyState == FileReader.DONE) {
                // strtolower
                if (fileExt == 'css') {
                    injectStyles(targetResult)
                } else {
                    // change the <title> to the file.MD. handy when printing
                    document.title = fileNameNoExt + '.' + fileExt;
                    var markUp = converter.makeHtml(targetResult);
                    document.getElementById("resume-mu").innerHTML = markUp;
                }
            }
        }

        // read the file
        reader.readAsText(f);
    }
    return true;
}

function theFilesReady(boolRFR) {

    if (boolRFR == true) {
        $('#settings').addClass('ref-files-ready');
    } else {
        //TODO - something is wrong
    }
}


// https://css-tricks.com/snippets/javascript/inject-new-css-rules/
function injectStyles(rule) {
    var div = $("<div />", {
        html: '<style>' + rule + '</style>'
    }).appendTo("body");
}


function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    evt.target.className = (evt.type == "dragover" ? "hover-drop" : "");
}

// http://www.html5rocks.com/en/tutorials/file/dndfiles/

function handleFileDropWrap(evt) {
    handleFileDrop(evt);
    var readyTheFiles = processTheFiles();
    theFilesReady(readyTheFiles);
}

function handleFileDrop(evt) {

    evt.stopPropagation();
    evt.preventDefault();

    objFiles = evt.dataTransfer.files; // FileList object.

    console.log(objFiles);

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = objFiles[i]; i++) {
        output.push('<span class="file-name">File: ', escape(f.name), '</span> ', '<span class="file-meta">(',
            f.size, ' bytes', ', ', 'Last Modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a', ')</span><br>'
        );
    }
    document.getElementById('files-received').innerHTML = output.join('');
}

var dropZone = document.getElementById('drop-zone');
// http://www.sitepoint.com/html5-file-drag-and-drop/
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('dragleave', handleDragOver, false);
dropZone.addEventListener('drop', handleFileDropWrap, false);


// prevent a file drop that misses the drop zone from being displayed in the browser.
// http://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
window.addEventListener("dragover", function (evt) {
    evt = evt || event;
    evt.preventDefault();
}, false);
window.addEventListener("drop", function (evt) {
    evt = evt || event;
    evt.preventDefault();
}, false);

document.getElementById('chevron-up').addEventListener("click", function () {
    document.getElementById('dnd-wrap').style.display = "none";
    document.getElementById('chevron-down').style.display = "block";
});

document.getElementById('chevron-down').addEventListener("click", function () {
    document.getElementById('dnd-wrap').style.display = "block";
    document.getElementById('chevron-down').style.display = "none";
});