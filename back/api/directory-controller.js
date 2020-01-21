let dirTree = require('directory-tree');
let serverConfig = require('../config/server');
let projectConfig = require('../config/project');

let getTree = (directory) => {

    return dirTree(directory, {
        extensions: /\.(html|pdf|txt|csv|png)$/
    });

};

let pipelineDirectory = (menu) => {

    let rootDirectory = serverConfig.path + 'pipeline-test/pipeline/';
    let dirs = projectConfig.api[menu];
    let result = [];

    // match menu with function
    let dirFunction = {
        'Raw_fastQC' : dirRawFastqc,
        'Filtered_fastQC' : dirRawFastqc,
        'RSEM_UCSC' : dirRsemUcsc,
        'Qualimap_UCSC' : dirQualimapUcsc,
        'Sample_Correlation' : dirCorrelation,
        'DEG' : dirDeg,
        'GSA' : dirGsa
    };

    for(let directory of dirs) {

        let fullDirectory = rootDirectory + directory;

        let dirResult = dirFunction[menu](fullDirectory, directory);

        result = result.concat(dirResult);

    }

    return result;

};

let dirRawFastqc = (directory, dirName) => {

    console.log('START Raw_fastQC');

    let regex = new RegExp(projectConfig.regex["pipeline-test/pipeline"]);

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

        let resultChildren = [];

        let fileNames = captionedResult[captionList[i]];

        for(let j = 0; j < fileNames.length; j++) {

            resultChildren.push({
                'type' : 'file',
                'label' : `result${j+1}`,
                'value' : `/${dirName}/${fileNames[j]}`
            });

        }

        result.push({
            'type' : 'caption',
            'label' : captionList[i],
            'value' : '',
            'children' : resultChildren
        });

    }

    console.log(result);

    return result;

};

let dirRsemUcsc = (directory, dirName) => {

    console.log('START RSEM_UCSC');

    let tree = getTree(directory);
    let files = tree.children;

    let result = [];
    let captionedResult = {};

    // parse file names
    for(let i = 0; i < files.length; i++) {

        let name = files[i].name;

        // only pdf files
        if(!name.endsWith('.pdf')) continue;

        let caption = name.substring(0, name.indexOf('.'));

        // if this is first file of this caption
        if(captionedResult[caption] === undefined) captionedResult[caption] = [];

        captionedResult[caption].push(name);

    }

    let captionList = Object.keys(captionedResult);

    // create result json
    for(let i = 0; i < captionList.length; i++) {

        result.push({
            'type' : 'file',
            'label' : captionList[i],
            'value' : `/${dirName}/${captionedResult[captionList[i]][0]}`
        });

    }

    console.log(result);

    return result;

};

let dirQualimapUcsc = (directory, dirName) => {

    console.log('START Qualimap_UCSC');

    let regex = new RegExp(projectConfig.regex["pipeline-test/pipeline"]);

    let tree = getTree(directory);
    let folders = tree.children;

    let result = [];

    for(let i = 0; i < folders.length; i++) {

        let label = folders[i].name;

        let regexResult = regex.exec(label);

        // wrong folder name
        if(regexResult === null) continue;

        result.push({
            'type' : 'file',
            'label' : label,
            'value' : `/${dirName}/${label}/qualimapReport.html`
        })

    }

    console.log(result);

    return result;

};

let dirCorrelation = (directory, dirName) => {

    console.log('START Sample_Correlation');

    let tree = getTree(directory);
    let files = tree.children;

    let result = [];
    let captionedResult = {};

    // parse file names
    for(let i = 0; i < files.length; i++) {

        let name = files[i].name;

        let caption = name.substring(0, name.indexOf('.'));

        // if this is first file of this caption
        if(captionedResult[caption] === undefined) captionedResult[caption] = [];

        captionedResult[caption].push(name);

    }

    let captionList = Object.keys(captionedResult);

    // create result json
    for(let i = 0; i < captionList.length; i++) {

        let resultChildren = [];

        let fileNames = captionedResult[captionList[i]];

        for(let j = 0; j < fileNames.length; j++) {

            let label = 'UNKNOWN';

            if(fileNames[j].includes('graph')) label = 'Correlataon Matrix';
            else if(fileNames[j].includes('heatmap')) label = 'Correlataon Heatmap';
            else if(fileNames[j].includes('pca')) label = 'PCA';

            resultChildren.push({
                'type' : 'file',
                'label' : label,
                'value' : `/${dirName}/${fileNames[j]}`
            });

        }

        result.push({
            'type' : 'caption',
            'label' : captionList[i],
            'value' : '',
            'children' : resultChildren
        });

    }

    console.log(result);

    return result;

};

let dirDeg = (directory, dirName) => {

    console.log('START DEG');

    let tree = getTree(directory);
    let files = tree.children;

    let resultChildren = [];

    for(let i = 0; i < files.length; i++) {

        let name = files[i].name;

        // only all & rawp & csv files
        if(!(name.startsWith('all_DEGs_') && name.endsWith('.csv')) && !((name.includes('all') || name.includes('sig')) && name.endsWith('.txt'))) continue;

        let label = 'UNKNOWN';

        if(name.includes('count')) {

            if(name.includes('sig')) label = 'Count Display';
            else label = 'Count Download';

        } else if(name.includes('fpkm')) {

            if(name.includes('rawp')) label = 'FPKM Display';
            else label = 'FPKM Download';

        } else if(name.includes('tpm')) {

            if(name.includes('rawp')) label = 'TPM Display';
            else label = 'TPM Download';

        }

        resultChildren.push({
            'type' : 'file',
            'label' : label,
            'value' : `/${dirName}/${name}`
        });

    }

    let result = {
        'type' : 'caption',
        'label' :  dirName.replace('08_', ''),
        'value' : '',
        'children' : resultChildren
    };

    console.log(result);

    return result;

};

let dirGsa = (directory, dirName) => {

    console.log('START GSA');

    let tree = getTree(directory);
    let folders = tree.children;

    let resultCategory = {
        'type' : 'category',
        'label' : dirName.replace('09_', ''),
        'value' : ''
    };

    let result = [];
    result.push(resultCategory);

    if(dirName.includes('DAVID') || dirName.includes('enrichR')) {

        for(let i = 0; i < folders.length; i++) {

            let files = folders[i].children;

            let resultChildren = [];

            for(let j = 0; j < files.length; j++) {

                let name = files[j].name;

                let label = name.substring(name.lastIndexOf('_')+1, name.lastIndexOf('.'));

                resultChildren.push({
                    'type' : 'file',
                    'label' : label,
                    'value' : `/${dirName}/${folders[i].name}/${name}`
                });

            }

            result.push({
                'type' : 'caption',
                'label' : folders[i].name,
                'value' : '',
                'children' : resultChildren
            });

        }

    } else if(dirName.includes('GSEA')) {

        for(let i = 0; i < folders.length; i++) {

            // only folders
            if(folders[i].children === undefined) continue;

            let innerFolders = folders[i].children;

            let resultChildren = [];

            for(let j = 0; j < innerFolders.length; j++) {

                let name = innerFolders[j].name;

                let label = name.substring(name.lastIndexOf('_')+1, name.indexOf('.'));

                resultChildren.push({
                    'type' : 'file',
                    'label' : label,
                    'value' : `/${dirName}/${folders[i].name}/${name}/index.html`
                });

            }

            result.push({
                'type' : 'caption',
                'label' : folders[i].name,
                'value' : '',
                'children' : resultChildren
            });

        }

    }

    console.log(result);

    return result;

};

module.exports = {

    pipelineDirectory : pipelineDirectory

};
