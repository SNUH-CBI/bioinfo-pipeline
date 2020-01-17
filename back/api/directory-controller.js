let dirTree = require("directory-tree");
let config = require('../config');

let getTree = (directory) => {

    return dirTree(directory, {
        extensions: /\.(html|pdf|text|csv|png|tiff|tif)$/
    });

};

let pipelineDirectory = (menu) => {

    let rootDirectory = config.directory;
    let dirs = config.api[menu];
    let result = [];

    // match menu with function
    let dirFunction = {
        'Raw_fastQC' : dirRawFastqc,
        'Filtered_fastQC' : dirFilteredFastqc,
        'RSEM_UCSC' : dirRsemUcsc,
        'Qualimap_UCSC' : dirQualimapUcsc,
        'Sample_Correlation' : dirCorrelation,
        'DEG' : dirDeg,
        'GSA' : dirGsa
    };

    for(let directory of dirs) {

        let fullDirectory = rootDirectory + directory;

        let dirResult = dirFunction[menu](fullDirectory, directory);

        result.push(dirResult);

    }

    return result;

};

let dirRawFastqc = (directory, dirName) => {

    console.log('START Raw_fastQC');

    let regex = new RegExp(config.regex["pipeline-test/pipeline"]);

    let tree = getTree(directory);
    let files = tree.children;

    let result = [];
    let captionedResult = {};

    // parse file names
    for(let i = 0; i < files.length; i++) {

        let name = files[i].name;

        let regexResult = regex.exec(name);

        // wrong file name
        if(regexResult === null) continue;

        let caption = regexResult[0];

        // if this is first file of this caption
        if(captionedResult[caption] === undefined) captionedResult[caption] = [];

        captionedResult[caption].push(name);

    }

    let captionList = Object.keys(captionedResult);

    // create result json
    for(let i = 0; i < captionList.length; i++) {

        let resultCaption = [];

        let files = captionedResult[captionList[i]];

        for(let j = 0; j < files.length; j++) {

            resultCaption.push({
                "type" : "file",
                "label" : `result${j+1}`,
                "value" : `/${dirName}/${files[j]}`
            });

        }

        result.push({
            "type" : "caption",
            "label" : captionList[i],
            "value" : "",
            "children" : resultCaption
        });

    }

    console.log(result);

    return result;

};

let dirFilteredFastqc = (directory) => {

};

let dirRsemUcsc = (directory) => {

};

let dirQualimapUcsc = (directory) => {

};

let dirCorrelation = (directory) => {

};

let dirDeg = (directory) => {

};

let dirGsa = (directory) => {

};

module.exports = {

    pipelineDirectory : pipelineDirectory

};
