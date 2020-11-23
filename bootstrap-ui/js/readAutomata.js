// $(document).ready(function () {

//     let template = ""

//     $("#iLanguage").change(function (value) {
//         createTT();
//     });

//     $("#iStates").change(function (value) {
//         createTT();
//     });

//     function createTT() {

//         // read inputs from UI
//         let inputLanguage = $("#iLanguage").val().trim();
//         let inputStates = $("#iStates").val().trim();


//         if (isValidInput(inputLanguage) && isValidInput(inputStates)) {

//             // split input
//             let language = inputLanguage.split(",");
//             let states = inputStates.split(",");
            
//             // create table content
//             let header = createTableHeader(language);
//             let body = createTableBody(language, states);
            
//             // read template
//             let template = $("#templateTT").html().trim();
            
//             // replace markers 
//             template = template.replace("$t-head", header);
//             template = template.replace("$t-body", body);    

//             // draw table to UI
//             $("#tableContainer").html(template);
//             $("#draw-automata").show();

//         } else {
//             alert("verify yout inputs");
//         }
//     }

//     function isValidInput(input) {
//         return (input.length > 0 && input.charAt(0) != "," && input.charAt(input.length - 1) != ",")
//     }

//     function createTableHeader(language) {
//         let header = "<tr><th scope='col'>@</th>"
//         language.forEach(symbol => {
//             header += "<th scope='col'>" + symbol + "</th>";
//         });
//         return header + ("</tr>");
//     }

//     function createTableBody(language, states) {        
//         let body = "";
//         states.forEach(state => {
//             body += "<tr><th scope='row'>" + state + "</th>";
//             language.forEach(symbol => {
//                 body += "<td>" + "<input type='text' width='70px' class='transitions form-control' data-src='" + state + "'" + "data-symbol='" + symbol + "'/>" + "</td>";
//             });
//             body += ("</tr>")   
//         });        
//         return body;
//     }

// });
