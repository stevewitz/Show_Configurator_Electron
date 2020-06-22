var count =0;
var wiz = {};
var welcomePath;
var dropzoneId ="Welcome";
var wizJsonString;
var service = [];
var convertServiceSlides = [];
var editService =[];
var type = "";
var editPath = "";
var filesAndDirectories = [];
var slidebFlag = [] ;

const remote = require("electron").remote;
const fs = require('fs');
const os = require('os');
const saveLocation = os.homedir() + "\\show";

document.addEventListener('dragenter', (e) => {
    if ((e.target.id != dropzoneId) && ((e.target.id).substring(0,4) !="show" )  ){
        e.preventDefault();
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";

    }

}, false);
//
//
// this is for drop of welcome image BELOW


document.addEventListener('drop', (e) => {

    if ((e.target.id != dropzoneId) && ((e.target.id).substring(0,4) !="show" )  ){
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";
    }
    e.preventDefault();
    for (const f of e.dataTransfer.files) {
        var stat = fs.lstatSync(f.path);
        var xxx = stat.isDirectory();
        if(stat.isDirectory() && (e.target.id).substring(0,4) =="show"){
            dropShowFiles(e.target.id, f.path);
        }

        else if (stat.isFile() && e.target.id == dropzoneId) { // make sure it's the correct dropzone for Welcome Image
          dropWelcome(f.path);
        }
    }
    return false;
},false);
document.addEventListener('dragover', (e) => {
    if ((e.target.id != dropzoneId) && ((e.target.id).substring(0,4) !="show" )  ){
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";
    }
    e.preventDefault();
    //  e.stopPropagation();
    return false;
},false);

//
// end of Welcome image drop ABOVE
//
//
//********************* Drop Welcome Image Here  ******************************
function dropWelcome(place){
    var allowedExtensions = /(\.jpg)$/i;
    if(!allowedExtensions.exec(place)) {
       // alert('Please upload Welcome Image jpg file only');
        Swal.fire({
            title: 'Wrong File Type',
            text: 'Please upload Welcome Image jpg file only',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK!'
        });
        return;  //get out now
    }
    else{
        let img = document.createElement("img");
        img.src = place;
        welcomePath = place;
        document.getElementById("Welcome").innerHTML = "Welcome Screen";
        document.getElementById("Welcome").appendChild(img);
        document.getElementById("Welcome").style.backgroundColor = 'white';
    }
}

//********************* Drop Show Folders Here  ******************************
function dropShowFiles(divid, fromFolder){
    let newdir ="";
  // let showName = '\\phantom2'; // REMOVE ThIS LINE +++++++++++++++++++++++++++++++++%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    if((divid.substring((divid.length - 4)) !== 'Text')){   // make sure we are updating data to Text suffix div only
        divid = divid+ 'Text'
    }

    let divUpdate = document.getElementById(divid); // get the element before changing the divid to get the rood description
    let correctedCount = 0;
    divUpdate.innerText = divUpdate.innerText +"Working..";
    console.log("folder dropped into: "+ divid + " and sent from: " + fromFolder);
    if((divid.substring((divid.length - 4)) === 'Text')){   // if the id ends with Text, get rid of it.
        divid = divid.substring(4, divid.length - 4); //get rid of show prefix too
    }
    else{
        divid = divid.substring(4 ); //get rid of show prefix
    }

    if(type=="edit"){
        newdir = (editPath + '\\' + divid) ;
    }
    else{
         newdir = (saveLocation + showName + '\\' + divid) ;  //.replace(/^.*(\\|\/|\:)/, '')); // get the correct save location for the files
    }
    for(let i=0; i < service.length; i++){
        if(service[i] === divid){
            slidebFlag =convertServiceSlides[i];
        }
    }

   // let newdir = 'C:\\Users\\Steve.WIZ\\show\\steve\\English' //divid;
    fs.readdir(fromFolder, (err, files) => {
        fileCaseCorrected='';
        console.log("There are this many files to copy: "+files.length);
      for (i =0; i< files.length; i++) {
          if(fs.lstatSync(fromFolder + "\\" + files[i]).isFile() ){

//888888888888888888888888888888888888888888888888888888888  Change to proper case
              switch (files[i].split('.').pop()) // files[i] contains the filename - the switch is on the filename extension
              {
                  case 'jpg':
                      //check for slidebflag
                      if(slidebFlag === false){
                          fileCaseCorrected = files[i].toLowerCase();
                      }
                      else{
                          // we have slide need slideb  -- check to see if it's already applied
                          var first = files[i].substring(0, files[i].indexOf('.')).toLowerCase();

                          if (first.charAt(first.length-1)!='b' ){
                              first = first +'b'
                          }
                          fileCaseCorrected = first + files[i].substring(files[i].indexOf('.')).toLowerCase() ;
                      }
                      break;

                  case 'mp3':
                      fileCaseCorrected = files[i].substring(0, files[i].indexOf('.')).toUpperCase() +files[i].substring(files[i].indexOf('.')).toLowerCase();
                      break;

                  case 'mp4':
                      fileCaseCorrected = files[i].toLowerCase();
                      break;

              }

//8888888888888888888888888888888888888

              console.log("copied file: " + files[i] + ' changed name to: ' + fileCaseCorrected);
              divUpdate.innerText = divid + "\n" +  (i)+ ' Files'  ;

              fs.copyFileSync(fromFolder + "\\" + files[i], newdir + "\\" + fileCaseCorrected, (error) => {      // <3>
                  if (error) {
                      console.log("error: " + error );
                  }
                  console.log("ok");
              });
          }
          else{
              correctedCount +=1;
              console.log(" corrected count: "+ correctedCount);
          }
      }
      fs.readdir(newdir, (err, files) => {
          console.log("This many files have been copied: " + (files.length - correctedCount) + ' Skipped ' + correctedCount + ' directorie(s)');
          divUpdate.innerText = divid + "\n" +  (i +0)+ ' Files Copied \n' + files.length + ' Total' ;
      });

    });
    console.log("Exiting  DROP SHOW FILES");
}

//******************** SAVE BUTTON FOR EDITING ****************
function saveEditButton() {
    console.log("save button  in EDIT MODE pressed");
    //change version now
    let current_datetime = new Date();
    let formatted_date =   current_datetime.getFullYear()+appendLeadingZeroes(current_datetime.getMonth() + 1) + appendLeadingZeroes(current_datetime.getDate()) +appendLeadingZeroes(current_datetime.getHours())+appendLeadingZeroes(current_datetime.getMinutes());

    document.getElementById("Version").value = formatted_date;// now put in updated version number

    let result = document.getElementById("wizdat").elements;


    for (i=0 ; i<result.length; i++){ //get all text  and number box inputs
        if((result[i].type =="text") ||(result[i].type == "number") ) {
            wiz[result[i].name] = result[i].value;
        }
        else if(result[i].type =="radio" && result[i].checked == true){ //get all radio button inputs
            wiz[result[i].name] = result[i].value;
        }
    }
    wiz["Version"]= formatted_date;
    wiz["Nothing"] = "SHOW  SETTINGS";// don't now why, but this is in current wiz.dat file

    showName = '\\' + document.getElementById('ShowName').value;
    wizJsonString =  JSON.stringify(wiz ).replace(/,/g, '\r\n').replace(/"/g,'');
    wizJsonString = wizJsonString.substr(1,wizJsonString.length -2);
    // add save for wiz.dat here
    fs.writeFile(editPath + "\\wiz.dat", wizJsonString, (err) => {
        if (err) {
            console.log("error creating wiz.dat " + err)
        }
    });

    for(i=0; i<service.length; i++){
        console.log('Service ' + i + ' = '+ service[i]);
        addShowDiv(service[i]);
    }
    document.getElementById("wizdat").style.display = 'none';
    document.getElementById("buttons").style.display = 'none';
   // document.getElementById("flexShow").style.display = 'flex';
    document.getElementById("folders").style.display = 'block';
    document.getElementById("flexShowText").style.display = 'block';

}

//******************** SAVE BUTTON  ***************************
function saveButton() {

    if(type == 'edit'){
        saveEditButton(); // if we are editing go here instead
        return;

    }

    console.log("save buton pressed");
    if(service.length == 0){
        console.log("no services entered")
        Swal.fire({
            title: 'No Services',
            text: 'You must include at least 1 service',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK!'
        })
        return;  //get out now
    }

    let result = document.getElementById("wizdat").elements;


    for (i=0 ; i<result.length; i++){ //get all text  and number box inputs
        if((result[i].type =="text") ||(result[i].type == "number") ) {
            wiz[result[i].name] = result[i].value;
        }
        else if(result[i].type =="radio" && result[i].checked == true){ //get all radio button inputs
            wiz[result[i].name] = result[i].value;
        }
    }
    wiz["Version"]= document.getElementById("Version").value
    wiz["Nothing"] = "SHOW  SETTINGS";// don't now why, but this is in current wiz.dat file

    showName = '\\' + document.getElementById('ShowName').value;
    wizJsonString =  JSON.stringify(wiz ).replace(/,/g, '\r\n').replace(/"/g,'');
    wizJsonString = wizJsonString.substr(1,wizJsonString.length -2);
    if (fs.existsSync(saveLocation + showName)) { // show directory is already there
       Swal.fire({
           title: 'Show Already Exists',
           text: 'Please change show name',
           type: 'error',
           showCancelButton: false,
           confirmButtonColor: '#3085d6',
           cancelButtonColor: '#d33',
           confirmButtonText: 'OK!'
       });
        return;  //get out now
    }
    else{
        if(welcomePath) {

            //create directory
            fs.mkdir(saveLocation + showName, function (err) {
                if (err) {
                    console.log('failed to create directory');
                    return console.error(err);
                } else {
                    console.log('Directory created successfully');
                }
                //  and write file
                fs.writeFile(saveLocation + showName + "\\wiz.dat", wizJsonString, (err) => {
                    if (err) {
                        console.log("error creating wiz.dat " + err)
                    }
                });
            });
        }

        else{
            Swal.fire({
                title: 'Welcome Image',
                text: 'Please add Welcome Image to show',
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK!'
        })
            return;  //get out now
        }
    }

    fs.copyFile (welcomePath, saveLocation + showName + '/Welcome.jpg', err => { //copy welcome image to show directory
        if (err){
            console.error(err)
        }
      //  console.log('copied Welcome Image!')
    });

     for(i=0; i<service.length; i++){
         console.log('Service ' + i + ' = '+ service[i]);
         addShowDiv(service[i],convertServiceSlides[i]);
         fs.mkdir(saveLocation + showName + '/' + service[i], function (err) { // add proper directory
             if (err) {
                 console.log('failed to create directory');
                 return console.error(err);
             } else {
                 console.log('Directory created successfully');
             }
         });
     }
    document.getElementById("wizdat").style.display = 'none';
    document.getElementById("buttons").style.display = 'none';
   // document.getElementById("flexShow").style.display = 'flex';
    document.getElementById("folders").style.display = 'block';
    document.getElementById("flexShowText").style.display = 'block';
}

//**********************  Save DEFAULT Configuration  *************************
function saveConfigButton(){

    Swal.fire({
        title: 'Are you sure?',
        text: "New default settings will replace existing settings",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, replace it!'
    }).then((result) => {
        if (result.value) {
            console.log("save defaults buton pressed");
            let result = document.getElementById("wizdat").elements;


            for (i=0 ; i<result.length; i++){ //get all text box inputs
                if((result[i].type =="text") ||(result[i].type == "number") ) {
                    wiz[result[i].name] = result[i].value;
                }
                else if(result[i].type =="radio" && result[i].checked == true){ //get all radio button inputs
                    wiz[result[i].name] = result[i].value;
                }
            }
            wiz["Nothing"] = "SHOW  SETTINGS";// don't now why, but this is in current wizdat file
            wiz["ShowName"] =""; //no show name is default settings -- also no version number in default

            fs.unlink(saveLocation + "\\master_wiz.dat", (err) => {
                if (err) {
                    console.log("failed to delete file: "+err);
                } else {
                    console.log('successfully deleted local file');
                }
                wizJsonString =  JSON.stringify(wiz ).replace(/,/g, '\r\n').replace(/"/g,'');
                wizJsonString = wizJsonString.substr(1,wizJsonString.length -2);

                fs.writeFile(saveLocation + "\\master_wiz.dat", wizJsonString, (err) => {
                    if (err) {
                        consloe.log("error: " + err);
                    }
                });

            });
            Swal.fire(
                'Replaced!',
                'Your defaults have now been replaced.',
                'success'
            )
        }
    })
}

function appendLeadingZeroes(n){
    if(n <= 9){
        return "0" + n;
    }
    return n
}

//******************* add a new show button clicked *****************************
function addNewShow(){
    type="add"
    document.getElementById("startup").style.display = 'none';
   // document.getElementById("flexShow").style.display = 'none';
    document.getElementById("folders").style.display = 'none';
    document.getElementById("flexShowText").style.display = 'none';
    document.getElementById("mainDiv").style.visibility='visible';
    document.getElementById("wizdat").style.display='inline-block';

    document.getElementById("saveFileLocation").innerHTML = document.getElementById("saveFileLocation").innerHTML + "This show will be saved at: " + saveLocation; //display to user the save show location
    // get info for Version
     let current_datetime = new Date();
     let formatted_date =   current_datetime.getFullYear()+appendLeadingZeroes(current_datetime.getMonth() + 1) + appendLeadingZeroes(current_datetime.getDate()) +appendLeadingZeroes(current_datetime.getHours())+appendLeadingZeroes(current_datetime.getMinutes());
     readDatFile( saveLocation + "/master_wiz.dat"); // put default values in form
     document.getElementById("Version").value = formatted_date;// now put in updated version number

    //this is for testing only **********************************************
          //    addShowDiv('English','English','English');
          //    addShowDiv('French','French','French');
          //    addShowDiv('DScriptive','DScriptive','DScriptive');
         //     addShowDiv('I6-English','I6-English','I6-English');


}
//***********************  EDIT EXISTING SHOW  *******************************
 function editExistingShow(){
 type = "edit";

  console.log("Existing show goes here");
  // open directory dialog
     const remote = require("electron").remote;
     const dialog = remote.dialog;
     dialog.showOpenDialog(remote.getCurrentWindow(), {
         properties: ["openDirectory" ],
        // defaultPath :saveLocation,
     }).then(result => {
         if (result.canceled === false) {
             console.log("Selected file paths:");
             console.log(result.filePaths[0]);
             editPath = result.filePaths[0];
             findAllFolderAndDirectories(result.filePaths[0]);
         }
     }).catch(err => {
         console.log(err)
     })
}
//********************************************* FIND ALL FOLDERS AND DIRECTORIES  *****************************************
function findAllFolderAndDirectories(showPath){
    let a, b , c =0;

    fs.readdir(showPath, (err, files) => {

        numFiles = [];
        numDirectories = [];
        let place = "";
        console.log("There are this many files in the edit show directory: " + files.length);
        for (i = 0; i < files.length; i++) {
            if (fs.lstatSync(showPath + "\\" + files[i]).isFile()) {

                console.log("file found: " + files[i]);
                numFiles.push(files[i])

            } else if (fs.lstatSync(showPath + "\\" + files[i]).isDirectory()) {
                numDirectories.push(files[i]);
            }
        }

        //check and make sure it's a  valid show folder
        if(numDirectories.length!=0){ // must have show directories and contain Welcome.img and wiz.dat
            console.log('Show directory')
            a = 1;
        }
        for(j=0; j<numFiles.length; j++){
            if(numFiles[j] == 'Welcome.jpg')
                b=1;
            if (numFiles[j] == 'wiz.dat') {
                c=1;
            }
        }
        if(a+b+c !=3){
            console.log("NOT A VALID SHOW!");
            Swal.fire(
                'Not a valid show!',
                'You selected an invalid show, please try again',
                'error'
            );
            return;
        }
        // we now have all the info need to populate the form
        document.getElementById("startup").style.display = 'none';
       // document.getElementById("flexShow").style.display = 'none';
        document.getElementById("folders").style.display = 'none';
        document.getElementById("flexShowText").style.display = 'none';
        document.getElementById("mainDiv").style.visibility='visible';
        document.getElementById("wizdat").style.display='inline-block';
        document.getElementById("saveFileLocation").innerHTML = document.getElementById("saveFileLocation").innerHTML + "This show will be saved at: " + showPath; //display to user the save show location
    //first the Welcome image gets populated here
        let img = document.createElement("img");
        try {
            img.src = showPath + '\\Welcome.jpg';
            welcomePath = showPath + '\\Welcome.jpg';
            document.getElementById("Welcome").innerHTML = "Welcome Screen";
            document.getElementById("Welcome").appendChild(img);
            document.getElementById("Welcome").style.backgroundColor = 'white';
        }
        catch{
            console.log('Welcome image not found')
        }

    //now for the wiz.dat info
        readDatFile( showPath + "\\wiz.dat"); // put default values in form
    // then add  services
        for(i=0; i<editService.length; i++) {
            var br = document.createElement("br");
            var newService = document.createElement("Input");
            newService.setAttribute('name', "Service" + count,);
            newService.setAttribute('readonly', true);
            newService.setAttribute('value', editService[i]);
            var newServiceLabel = document.createElement("Label");
            newServiceLabel.innerText = "Service" + count + " ";
            count++;
            service.push(editService[i]);
            document.getElementById("systemServicesDiv").appendChild(newServiceLabel);
            document.getElementById("systemServicesDiv").appendChild(newService);
            if((count !=0) && (count % 2 ==0)){
                document.getElementById("systemServicesDiv").appendChild(document.createElement("br"));
            }
        }

    })
}

//********************************* ADD SERVICE ************************************
async function addService() {
    let slideString="";
    await Swal.fire({
        title: '<strong>Enter Service</strong>',
        type: 'question',
        html:
              '<input autofocus  type="text" id = "serviceBox"  placeholder = "Enter Service Name" > </input><br><br>' +
              '<input type="checkbox" id = "bFlag" >Convert slides to <strong><u>slideb?</strong></u></input><br>'
           ,
        showConfirmButton: true,
        focusConfirm:false,
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (!result.value) {
            return;
        }
        else{
            let serviceName = document.getElementById('serviceBox').value;
            slidebFlag = document.getElementById('bFlag').checked;
            if(slidebFlag == true){
                slideString = "Are you sure? (slides converted to slideb)";
            }
            else{
                slideString = "Are you sure?"
            }
            ///   const { value: serviceName } = await Swal.fire({
            ///       title: 'Enter service',
            ///       input: 'text',
            ///       showCancelButton: true,
            ///       type:'question',
            ///       inputPlaceholder: 'Enter Service Name'
            ///   });

            if (serviceName) {

                for(i=0; i<service.length; i++){
                    if(serviceName === service[i]){
                        //   alert("Duplicate service!");
                        Swal.fire(
                            'Duplicate!',
                            'Your entered a duplicate SERVICE, please try again',
                            'error'
                        );
                        return; // exit function
                    }
                }

                Swal.fire({
                    title: 'Service ' +'"'+serviceName + '"' + ' will be created',
                    text: slideString,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (!result.value) {
                        return;
                    }
                    else{
                        var br = document.createElement("br");
                        var newService = document.createElement("Input");
                        newService.setAttribute('name', "Service" + count,);
                        newService.setAttribute('readonly',false);
                        newService.setAttribute('value', serviceName);
                        var newServiceLabel = document.createElement("Label");
                        newServiceLabel.innerText = "Service" + count + " ";
                        count++;
                        service.push(serviceName );
                        convertServiceSlides.push(slidebFlag)
                        document.getElementById("systemServicesDiv").appendChild(newServiceLabel);
                        document.getElementById("systemServicesDiv").appendChild(newService);
                        if ((count != 0) && (count % 2 == 0)) {
                            document.getElementById("systemServicesDiv").appendChild(document.createElement("br"));
                        }
                    }
                });
            }

        }
    });

}

//************************ Puts up a new div for each show folder ************************
function addShowDiv(divId,convertSlides ){
    let fileinfo = "";
    let newestDir = "";
    let numberOfFiles=0;
    if(type == 'edit') {
        newestDir = editPath + '\\' + divId;
    }
    else{
        newestDir = saveLocation + '\\' + divId;
    }
        fs.readdir(newestDir, (err, files) => {
            if (files) {
                console.log('Folder: ' + divId + " -- Files: " + files.length);
                filesAndDirectories.push([divId, files.length]);
                fileinfo = files.length + ' Files';
            } else {
                fileinfo = '0 Files';
            }
            ///
            ///
            ///
            let div = document.createElement('div');

            div.setAttribute('class', 'showFlex');
            div.id = divId;
            div.name = divId;

            document.getElementById("flexShow").appendChild(div);
            if(convertSlides == true){
                convertS = "true";
                let divConvert = document.createElement('div');
                div.setAttribute('class','changeToSlideb');
                divConvert.innerHTML = 'Converting to slideb';
                divConvert.setAttribute('class','slideb');
                document.getElementById(divId).appendChild(divConvert);
            }
            else{
                convertS = "false";
            }


            // div.innerHTML  <p>divText</p>;

            //div.style.height="100px";



            var img = document.createElement("img");
            img.class = "showFlex1";
            img.id = 'show' + divId;
            img.src = "./folder.png";
            // img.style.height="100%";
            //  img.style.marginRight="25px";
            img.setAttribute('class', 'showFlex1');
            img.name = divId;
            img.addEventListener("click", imageClick, false);
            var src = document.getElementById(divId);
            src.appendChild(img)
            let div1 = document.createElement('div');
            div1.id = 'show' + divId + 'Text';
            div1.setAttribute('class', 'divText');
            div1.addEventListener("click", imageClick, false);
            div1.innerHTML = divId + '<br/>' + fileinfo;
            div1.name = divId;
            //div.style.height="100px";
            document.getElementById(divId).appendChild(div1);

        });
}


//*************************  clicked file icon image to bring up opendialog  ******************************************
function imageClick(event){ //user has clicked on one of the show folders
    console.log(os.homedir());
    console.log("clicked: " + event.target.name);

    dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ["openDirectory" ]
    }).then(result => {
        if (result.canceled === false) {
            console.log("Selected file paths:");
            console.log(result.filePaths[0]);
            dropShowFiles('show'+ event.target.name+'Text', result.filePaths[0]);
        }
    }).catch(err => {
        console.log(err)
    })
}

//*************************  clicked WELCOME image to bring up opendialog  ******************************************
function welcomeClick(){
    console.log('clicked Welcome Image' );
    const remote = require("electron").remote;
    const dialog = remote.dialog;
    dialog.showOpenDialog(remote.getCurrentWindow(), {
        filters:[{ name: 'JPG Files', extensions: ['jpg'] }],
        properties: ["openFile" ]
    }).then(result => {
        if (result.canceled === false) {
            console.log("Selected file paths:");
            console.log(result.filePaths[0]);
            dropWelcome(result.filePaths[0]);
        }
    }).catch(err => {
        console.log(err)
    })
}
//************************************************** READ AND PARSE WIZ.DAT  *********************************************
function readDatFile(filename) { //read the wiz.dat file and populate teh screen parameters with it.
    let parameter;
    let value;

    try {
        // read contents of the file
        const data = fs.readFileSync(filename, 'UTF-8');
        // split the contents by new line
        const lines = data.split(/\r?\n/);

        lines.forEach((line) => {
            if (line.indexOf(':') != -1) { // make sure there is a :

                parameter=line.substr(0, line.indexOf(':'));
                value= line.substr(line.indexOf(':') + 1).trim();
                try{
                    if(parameter=='StartUp'){
                        if (value==1){
                            document.getElementById("manualStartup").checked = true;
                        }
                        else{
                            document.getElementById("autoStartup").checked = true;
                        }
                    }
                    else if(parameter=='I6_Orientation'){ // for radio buttons

                        if (value=='L'){
                            document.getElementById("I6_OrientationL").checked = true;
                        }
                        else{
                            document.getElementById("I6_OrientationR").checked = true;
                        }
                    }
                    else{
                        if((parameter.substring(0,7))== 'Service'){
                        editService.push(value);
                    }
                        document.getElementById(parameter).value = value;

                    }
                }
                catch {
                   // console.log("error reading wiz.dat")
                }

            } else {
                console.log('Invalid line colon not found - ignoring:' + line);
            }

        });
    } catch (err) {
        console.error(err);
    }
}

function exit() {
    let showLocation = '';
    if(type == 'edit') {
        showLocation = editPath;
    }
    else if(type == 'add') {
        showLocation = saveLocation;
    }


        Swal.fire({
            title: 'Are you sure?',
            text: "Files will be saved at: \n" + showLocation,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'YES'
        }).then((result) => {
            if (result.value === true) {

                let app = remote.getCurrentWindow();
                app.close();
            }
        });







}
