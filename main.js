// Connecting to Dropbox
        $("#pass-form").hide();
        $("#content").hide();
        $("#uploaded").hide();
        var dbx; 
        
        var table="";
        var content = document.getElementById('file-content');
        var btn = document.getElementById('btn-show-table');
        btn.style.display = "none";

        // data in file
        loadFiles();
        
        // listing files and folders placed in Dropbox
        function loadFiles(){
        dbx = new Dropbox.Dropbox({ 
                accessToken:"gtErH3Zem8AAAAAAAAAAcVjXOPX03lMnKZ8WHyYh4IWyGpUSI-nBTtch8O9UMImr" });
            dbx.filesListFolder({path: ''})
          .then(function(response) {
            console.log(response.entries);
            myfile=response.entries;
            readFile(response.entries);
          })
          .catch(function(error) {
            console.log(error);
          });    
        }
        
        function readFile(my_files){
            dbx.filesDownload({path: my_files[1].path_lower})
               .then(function (response) {
                    console.log(response);
                    var blob = response.fileBlob;
                
                    // Line 1
                    var reader = new FileReader();
                    
                    // Line 2
                    reader.addEventListener("loadend", function() {
                        btn.style = "block";
                        console.log(reader.result); // will print out file content
                        var result = reader.result;
                        //var numberOfLineBreaks = (result.match(/\n/g)||[]).length;
                        //alert('Number of breaks: ' + numberOfLineBreaks);
                        data = result;
                        
                        var splitted = result.split('\n');
                        
                        content.innerHTML = "";
                        table.innerHTML = "";
                        
                        table = document.createElement('table');
                        table.setAttribute('border',1);
                        table.setAttribute('class',"data-table");
                        table.setAttribute('id',"data-table");
                        
                        // Row
                        for (i=0; i<splitted.length; i++){
                            var tr = document.createElement('tr');
                            var line = splitted[i];
                            var line_splitted = line.split(',');
                            
                            // Read columns
                            for (j=0; j<line_splitted.length; j++){
                                if (i == 0){
                                    var th = document.createElement('th');
                                    th.innerHTML = line_splitted[j]
                                    tr.appendChild(th);
                                }
                                else{
                                    var td = document.createElement('td');
                                    td.innerHTML = line_splitted[j]
                                    tr.appendChild(td);
                                }    
                            }
                            
                            table.appendChild(tr);
                            
                        }
                        
                        $("#pre").remove();
                        $("#pass-form").show();
                        $("#content").show();
                    });
                
                    // Line 3
                    reader.readAsText(blob);
                
                })
                .catch(function (error) {
                    console.log(error);
                });
        }        
        
        
        function addFile()
        {
             $('#loader').removeClass().addClass('loaderr');
             var passForm=document.getElementById("pass-form");
             var nameId = document.getElementById('name_id');
             var cityId=document.getElementById("city_id");
             var emailId= document.getElementById('email_id');
             var contactId= document.getElementById('contact_id');
             var fileInput = document.getElementById('file-upload');
             var file = fileInput.files[0];
     
            dbx.filesUpload({path: '/New/' + file.name, contents:file , mode: "overwrite"})
              .then(function(response) {
                console.log(response);
              })
              .catch(function(error) {
                console.error(error);
              });
            
            var concat=data+"\n"+
                       passForm.name.value +','+ 
                       passForm.city.value +','+ 
                       passForm.email.value +','+ 
                       passForm.contact_number.value+','+
                       file.name;
                dbx.filesUpload({path: "/data.csv", contents: concat, mode: "overwrite"})
              .then(function(response) {
                 passForm.reset();
                 loadFiles();
                //var results = document.getElementById('results');
                //results.appendChild(document.createTextNode('File uploaded!'));
                console.log(response);
             $(document).ready(function() {
                 $('#loader').hide(function(){
                    $("#pass-form").hide();
                    $("#content").hide();
                    $('#btn-show-table').hide();
                    $('#uploaded').show();
                 });
                });
                
//                    location.reload();
              })
              .catch(function(error) {
                console.error(error);
              });
        }

            function showTable(){
                content.appendChild(table);
            $(document).ready(function(){
               $("#data-table").tablesorter();
            });
            }
