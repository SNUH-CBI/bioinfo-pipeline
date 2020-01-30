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
        'Raw_fastQC' : getFastqc,
        'Filtered_fastQC' : getFastqc,
        'RSEM_UCSC' : getRsemUcsc,
        'Qualimap_UCSC' : getQualimapUcsc,
        'Sample_Correlation' : getCorrelation,
        'DEG' : getDeg,
        'GSA' : getGsa
    };

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
    let captionedResult = {};

    // parse file names
    for(let i = 0; i < files.length; i++) {

        const name = files[i].name;

        const regexResult = regex.exec(name);

        // wrong file name
        if(regexResult === null) continue;

        const caption = regexResult[0];

        // if this is first file of this caption
        if(captionedResult[caption] === undefined) captionedResult[caption] = [];

        captionedResult[caption].push(name);

    }

    const captionList = Object.keys(captionedResult);

    // create result json
    for(let i = 0; i < captionList.length; i++) {

        let resultChildren = [];

        const fileNames = captionedResult[captionList[i]];

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

    utility.print(JSON.stringify(result));
    utility.print('Finished fastQC');

    return result;

};

const getRsemUcsc = (directory, dirName) => {

    utility.print('Getting RSEM_UCSC...');

    const tree = getTree(directory);
    const files = tree.children;

    let result = [];
    let captionedResult = {};

    // parse file names
    for(let i = 0; i < files.length; i++) {

        const name = files[i].name;

        // only pdf files
        if(!name.endsWith('.pdf')) continue;

        const caption = name.substring(0, name.indexOf('.'));

        // if this is first file of this caption
        if(captionedResult[caption] === undefined) captionedResult[caption] = [];

        captionedResult[caption].push(name);

    }

    const captionList = Object.keys(captionedResult);

    // create result json
    for(let i = 0; i < captionList.length; i++) {

        result.push({
            'type' : 'file',
            'label' : captionList[i],
            'value' : `/${dirName}/${captionedResult[captionList[i]][0]}`
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
            'type' : 'file',
            'label' : label,
            'value' : `/${dirName}/${label}/qualimapReport.html`
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
    let captionedResult = {};

    // parse file names
    for(let i = 0; i < files.length; i++) {

        const name = files[i].name;

        const caption = name.substring(0, name.indexOf('.'));

        // if this is first file of this caption
        if(captionedResult[caption] === undefined) captionedResult[caption] = [];

        captionedResult[caption].push(name);

    }

    const captionList = Object.keys(captionedResult);

    // create result json
    for(let i = 0; i < captionList.length; i++) {

        let resultChildren = [];

        const fileNames = captionedResult[captionList[i]];

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

        const name = files[i].name;

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

    const result = {
        'type' : 'caption',
        'label' :  dirName.replace('08_', ''),
        'value' : '',
        'children' : resultChildren
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
        'type' : 'category',
        'label' : dirName.replace('09_', ''),
        'value' : ''
    };

    let result = [];
    result.push(resultCategory);

    if(dirName.includes('DAVID') || dirName.includes('enrichR')) {

        for(let i = 0; i < folders.length; i++) {

            const files = folders[i].children;

            let resultChildren = [];

            for(let j = 0; j < files.length; j++) {

                const name = files[j].name;

                const label = name.substring(name.lastIndexOf('_')+1, name.lastIndexOf('.'));

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

            const innerFolders = folders[i].children;

            let resultChildren = [];

            for(let j = 0; j < innerFolders.length; j++) {

                const name = innerFolders[j].name;

                const label = name.substring(name.lastIndexOf('_')+1, name.indexOf('.'));

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

    console.log(JSON.stringify(result));
    utility.print('Finished GSA');

    return result;

};

module.exports = {
    pipelineDirectory : pipelineDirectory
};
