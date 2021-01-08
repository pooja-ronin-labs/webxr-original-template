// 'use strict'
const fs = require('fs');
const gltfPipeline = require('gltf-pipeline');
const fsExtra = require('fs-extra');
const GLBPacker = require('./glb-packer')
const writer = require('./glb-writer')
const { compress } = require("compress-images/promise");

const processGltf = gltfPipeline.processGltf;

const files = ["src/models/gltf/OnePlusWorld_v16_NewLightBake06_For\ Video_00011.gltf",
               "src/models/gltf/avatar/Female_BaseMesh_Walk_10.gltf",
               "src/models/gltf/avatar/Male_BaseMesh_Walk_19.gltf",
               "src/models/gltf/Auditorium_Baked_v07.gltf",
               "src/models/gltf/Maze_v05.gltf"]
let settings= {
    "low":"40",
    "medium":"60",
    "high":"80"
  }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }
const tmpFolder = getRandomInt(1000);

async function compress_pipeline(gltf_file,setting){
    const gltf = fsExtra.readJsonSync(gltf_file);
    const options = {
        separateTextures: true
    };
    let fileName = gltf_file.split("/")
    fileName = fileName[fileName.length-1]


    fs.mkdirSync(`/tmp/${tmpFolder}/tt`)

    const results = await processGltf(gltf, options)
    if(results){
        fsExtra.writeJsonSync(`/tmp/${tmpFolder}/tt/gltf.gltf`, results.gltf);
        // Save separate resources
        const separateResources = results.separateResources;
        for (const relativePath in separateResources) {
            if (separateResources.hasOwnProperty(relativePath)) {
                const resource = separateResources[relativePath];
                fsExtra.writeFileSync(`/tmp/${tmpFolder}/tt/${relativePath}`, resource);
            }
        }

        const INPUT_path_to_your_images = `/tmp/${tmpFolder}/tt/*.{jpg,JPG,jpeg,JPEG}`;
        const OUTPUT_path = `/tmp/${tmpFolder}/tt/c/`;

        const { statistics, errors } = await compress( {
            source: INPUT_path_to_your_images,
            destination : OUTPUT_path,
            enginesSetup: {
                jpg: { engine: 'mozjpeg', command: ['-quality', settings[setting]]},
            }
        })
        fsExtra.copySync(`/tmp/${tmpFolder}/tt/c/`, `/tmp/${tmpFolder}/tt/`,{overwrite:true})
        fs.rmdirSync(`/tmp/${tmpFolder}/tt/c`, {recursive: true})


        const files = fs.readdirSync(`/tmp/${tmpFolder}/tt`)
        let buffers=[]
        files.forEach((f) => {
          const readerContent = fs.readFileSync(`/tmp/${tmpFolder}/tt/`+f);
          let imageBuffer = Buffer.from(readerContent)
          buffers[f] = imageBuffer

        })
        const jsonBufferKey = Object.keys(buffers).find((k) => k.indexOf('.gltf') != -1)
        const jsonBuffer = buffers[jsonBufferKey]
        const pathCharacters = jsonBufferKey.lastIndexOf('/') + 1
        if (pathCharacters != 0) {
          Object.keys(buffers).forEach(k => {
            const newKey = k.substring(pathCharacters)
            buffers[newKey] = buffers[k]
          })
        }
        const dec = new TextDecoder("utf-8");
        const json = JSON.parse(dec.decode(jsonBuffer))
        const glb = GLBPacker(json, buffers)
        const output = writer(glb)
        fileName = fileName.split(".")[0]
        fs.writeFileSync(`src/models/gltf/${setting}/${fileName}.glb`,output)
    }
    fs.rmdirSync(`/tmp/${tmpFolder}/tt`, {recursive: true})
}

(async ()=>{

    fs.mkdirSync(`/tmp/${tmpFolder}`)
    for(let i=0;i<files.length;++i)
    {
      await compress_pipeline(files[i],"high")
      await compress_pipeline(files[i],"medium")
      await compress_pipeline(files[i],"low")
    }
    fs.rmdirSync(`/tmp/${tmpFolder}`, {recursive: true})
})()
// files.forEach
