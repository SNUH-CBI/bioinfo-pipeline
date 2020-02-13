const fs            = require('fs');
const dirTree       = require('directory-tree');
const utility       = require('../../utility');
const serverConfig  = require('../../config/server.json');
const projectConfig = require('../../config/project.json');

const getTree = (directory) => {

    return dirTree(directory, {
        extensions: /\.(html|pdf|txt|csv|png)$/
    });

};

const pipelineDirectory = (menu) => {

    const rootDirectory = serverConfig.path + 'pipeline-test/pipeline/';
    const dirs = projectConfig.api[menu];
    let result = [];

    // match menu with function
    const dirFunction = {
        'Raw_fastQC': getFastqc,
        'Filtered_fastQC': getFastqc,
        'RSEM_UCSC': getRsemUcsc,
        'Qualimap_UCSC': getQualimapUcsc,
        'Sample_Correlation': getCorrelation,
        'DEG': getDeg,
        'GSA': getGsa
    };

    // combine each directory results
    for(let directory of dirs) {

        const fullDirectory = rootDirectory + directory;
        const dirResult = dirFunction[menu](fullDirectory, directory);

        result = result.concat(dirResult);

    }

    return result;

};

const getFastqc = (directory, dirName) => {

    utility.print('Getting fastQC...');

    const regex = new RegExp(projectConfig.regex["pipeline-test/pipeline"]);

    const tree = getTree(directory);
    const files = tree.children;

    let result = [];
    let captionOrganize = {}; // file names organized by caption

    // parse file names
    for(let i = 0; i < files.length; i++) {

        const fileName = files[i].name;

        const regexResult = regex.exec(fileName);

        // wrong file name
        if(regexResult === null) continue;

        const caption = regexResult[0];

        // if this is first file of this caption, create empty list
        if(captionOrganize[caption] === undefined) captionOrganize[caption] = [];

        captionOrganize[caption].push(fileName);

    }

    const captionList = Object.keys(captionOrganize); // list of captions from organized file names

    // create result json
    for(let i = 0; i < captionList.length; i++) {

        let resultChildren = [];

        // file names belonging to a caption
        const captionFiles = captionOrganize[captionList[i]];

        for(let j = 0; j < captionFiles.length; j++) {

            resultChildren.push({
                'type': 'file',
                'label': `result${j+1}`,
                'value': `/${dirName}/${captionFiles[j]}`
            });

        }

        result.push({
            'type': 'caption',
            'label': captionList[i],
            'value': '',
            'children': resultChildren
        });

    }

    utility.print(JSON.stringify(result));
    utility.print('Finished fastQC');

    return result;

};

const getRsemUcsc = (directory, dirName) => {

    utility.print('Getting RSEM_UCSC...');

    const tree = getTree(directory);
    const files = tree.children;

    let result = [];
    let captionOrganize = {}; // file names organized by caption

    // parse file names
    for(let i = 0; i < files.length; i++) {

        const fileName = files[i].name;

        // only pdf files
        if(!fileName.endsWith('.pdf')) continue;

        const caption = fileName.substring(0, fileName.indexOf('.'));

        // if this is first file of this caption, create empty list
        if(captionOrganize[caption] === undefined) captionOrganize[caption] = [];

        captionOrganize[caption].push(fileName);

    }

    const captionList = Object.keys(captionOrganize); // list of captions from organized file names

    // create result json
    for(let i = 0; i < captionList.length; i++) {

        result.push({
            'type': 'file',
            'label': captionList[i],
            'value': `/${dirName}/${captionOrganize[captionList[i]][0]}`
        });

    }

    utility.print(JSON.stringify(result));
    utility.print('Finished RSEM_UCSC');

    return result;

};

const getQualimapUcsc = (directory, dirName) => {

    utility.print('Getting Qualimap_UCSC...');

    const regex = new RegExp(projectConfig.regex["pipeline-test/pipeline"]);

    const tree = getTree(directory);
    const folders = tree.children;

    let result = [];

    for(let i = 0; i < folders.length; i++) {

        const label = folders[i].name;

        // check wrong folder name
        if(regex.exec(label) === null) continue;

        result.push({
            'type': 'file',
            'label': label,
            'value': `/${dirName}/${label}/qualimapReport.html`
        })

    }

    utility.print(JSON.stringify(result));
    utility.print('Finished Qualimap_UCSC');

    return result;

};

const getCorrelation = (directory, dirName) => {

    utility.print('Getting Sample_Correlation...');

    const tree = getTree(directory);
    const files = tree.children;

    let result = [];
    let captionOrganize = {}; // file names organized by caption

    // parse file names
    for(let i = 0; i < files.length; i++) {

        const fileName = files[i].name;

        const caption = fileName.substring(0, fileName.indexOf('.'));

        // if this is first file of this caption, create empty list
        if(captionOrganize[caption] === undefined) captionOrganize[caption] = [];

        captionOrganize[caption].push(fileName);

    }

    const captionList = Object.keys(captionOrganize); // list of captions from organized file names

    // create result json
    for(let i = 0; i < captionList.length; i++) {

        let resultChildren = [];

        // file names belonging to a caption
        const captionFiles = captionOrganize[captionList[i]];

        for(let j = 0; j < captionFiles.length; j++) {

            let label = 'UNKNOWN';

            if(captionFiles[j].includes('graph')) label = 'Correlataon Matrix';
            else if(captionFiles[j].includes('heatmap')) label = 'Correlataon Heatmap';
            else if(captionFiles[j].includes('pca')) label = 'PCA';

            resultChildren.push({
                'type': 'file',
                'label': label,
                'value': `/${dirName}/${captionFiles[j]}`
            });

        }

        result.push({
            'type': 'caption',
            'label': captionList[i],
            'value': '',
            'children': resultChildren
        });

    }

    utility.print(JSON.stringify(result));
    utility.print('Finished Sample_Correlation');

    return result;

};

const getDeg = (directory, dirName) => {

    utility.print('Getting DEG...');

    const tree = getTree(directory);
    const files = tree.children;

    let resultChildren = [];

    for(let i = 0; i < files.length; i++) {

        const fileName = files[i].name;

        // only all & rawp & csv files
        if(!(fileName.startsWith('all_DEGs_') && fileName.endsWith('.csv')) && !((fileName.includes('all') || fileName.includes('sig')) && fileName.endsWith('.txt'))) continue;

        let label = 'UNKNOWN';

        if(fileName.includes('count')) {

            if(fileName.includes('sig')) label = 'Count Display';
            else label = 'Count Download';

        } else if(fileName.includes('fpkm')) {

            if(fileName.includes('rawp')) label = 'FPKM Display';
            else label = 'FPKM Download';

        } else if(fileName.includes('tpm')) {

            if(fileName.includes('rawp')) label = 'TPM Display';
            else label = 'TPM Download';

        }

        const metadataFile = `${directory}/${fileName}.metadata.json`;
        const metadataString = fs.readFileSync(metadataFile, 'utf8');
        const metadata = JSON.parse(metadataString);

        resultChildren.push({
            'type': 'file',
            'label': label,
            'value': `/${dirName}/${fileName}`,
            'row': metadata.line
        });

    }

    const result = {
        'type': 'caption',
        'label':  dirName.replace('08_', ''),
        'value': '',
        'children': resultChildren
    };

    utility.print(JSON.stringify(result));
    utility.print('Finished DEG');

    return result;

};

const getGsa = (directory, dirName) => {

    utility.print('Getting GSA...');

    const tree = getTree(directory);
    const folders = tree.children;

    const resultCategory = {
        'type': 'category',
        'label': dirName.replace('09_', ''),
        'value': ''
    };

    let result = [];
    result.push(resultCategory);

    if(dirName.includes('DAVID') || dirName.includes('enrichR')) {

        for(let i = 0; i < folders.length; i++) {

            const files = folders[i].children;

            let resultChildren = [];

            for(let j = 0; j < files.length; j++) {

                const fileName = files[j].name;

                const label = fileName.substring(fileName.lastIndexOf('_')+1, fileName.lastIndexOf('.'));

                resultChildren.push({
                    'type': 'file',
                    'label': label,
                    'value': `/${dirName}/${folders[i].name}/${fileName}`
                });

            }

            result.push({
                'type': 'caption',
                'label': folders[i].name,
                'value': '',
                'children': resultChildren
            });

        }

    } else if(dirName.includes('GSEA')) {

        for(let i = 0; i < folders.length; i++) {

            // only folders
            if(folders[i].children === undefined) continue;

            const innerFolders = folders[i].children;

            let resultChildren = [];

            for(let j = 0; j < innerFolders.length; j++) {

                const folderName = innerFolders[j].name;

                const label = folderName.substring(folderName.lastIndexOf('_')+1, folderName.indexOf('.'));

                resultChildren.push({
                    'type': 'file',
                    'label': label,
                    'value': `/${dirName}/${folders[i].name}/${folderName}/index.html`
                });

            }

            result.push({
                'type': 'caption',
                'label': folders[i].name,
                'value': '',
                'children': resultChildren
            });

        }

    }

    console.log(JSON.stringify(result));
    utility.print('Finished GSA');

    return result;

};

module.exports = {
    pipelineDirectory : pipelineDirectory
};
