"use strict";
const Shell = require('node-powershell');
const notifier = require('node-notifier');
const path = require('path');
const si = require('systeminformation');
const {shutdown} = require('wintools');


function executePowershell(cmd){
    console.log(`Execute Powershell command:\n${cmd}`);
    const ps = new Shell({
        executionPolicy: 'Bypass',
        noProfile: true
      });
      
      ps.addCommand(cmd);
      ps.invoke()
      .then(output => {
        console.log(output);
      });
}

function winShutdown(){
    shutdown.poweroff();
}

function winRestart(){
    shutdown.restart();
}

async function getSystemInfos(){
    console.log(`Get system infos`);
    const info = await si.osInfo();
    return {answer: info};
}


function Notify({title, message}){
    let icon = process.env.IO_LOGO_PATH ?? `./io_logo.png`;
    if(icon)
        icon = path.join(__dirname,icon);
    if(!title)
        title = "Nachricht vom Server";
    notifier.notify({
        title,
        message,
        icon: process.env.IO_LOGO_PATH ?? `./io_logo.png`
      });
}


module.exports = {
    shutdown: () => {
        try{
            return winShutdown();
        } catch(err){
            return {err};
        }
    },
    restart: () => {
        try{
            return winRestart();
        } catch(err){
            return {err};
        }
    },
    notify: ({title, message}) => {
        try{
            return Notify({title, message});
        } catch(err){
            return {err};
        }
    },
    systemInfo: () => {
        try{
            return getSystemInfos();
        } catch(err){
            return {err};
        }
    },
    powershell: (cmd) => {
        try{
            return executePowershell(cmd);
        } catch(err){
            return {err};
        }
    }
}