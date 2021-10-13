var totalOrg = 1;

var regexNomeRede = /^[^0-9\sæ/?°®ŧ←←↓→→øøþłĸĸħŋđđðßæ»©““”µàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôû ÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ!@#$%~^`´&*()_+\-=\[\]{};':"\\|,.<>\/?][A-Za-z0-9][^\sæ/?°®ŧ←←↓→→øøþłĸĸħŋđđðßæ»©““”µàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôû ÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ!@#$%~^`´&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
var boolNomeRede = false;
var regexNomeCanal = /^[A-Za-z]+$/;
var boolNomeCanal = false;
var regexNomeOrg = /^[^0-9\sæ/?°®ŧ←←↓→→øøþłĸĸħŋđđðßæ»©““”µàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôû ÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ!@#$%~^`´&*()_+\-=\[\]{};':"\\|,.<>\/?][A-Za-z0-9][^\sæ/?°®ŧ←←↓→→øøþłĸĸħŋđđðßæ»©““”µàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôû ÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ!@#$%~^`´&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
var boolNomeOrg = false;

var boolNumOrg = false

$(document).on('click','#addOrg',function(){
    totalOrg++;  
    $('#orgList').append('<div class="row" id="rowId'+totalOrg+'">'
    +   '    <div class="col-md-5">'
    +   '       <div class="form-group">'
    +   '           <input type="text" class="form-control" id="nomeOrg" name="nomeOrg[]"'
    +   '       placeholder="Digite o nome da organização" required>'
    +   '       </div>'
    +   '   </div>'
    +   '   <div class="col-md-5">'
    +   '       <div class="form-group">'
    +   '           <input type="number" min="1" class="form-control" id="numPeer" name="numPeer[]"'
    +   '           placeholder="Digite o número de nós da organização" required>'
    +   '       </div>'
    +   '   </div>'
    +   '   <div class="col-md-2">'
    +   '       <a id="'+totalOrg+'" onclick="deleteOrgRow(this.id)" class="btn btn-danger" href="#" title="Remover Organização"><i class="ti-close"></i></a>'
    +   '   </div>'
    +   '  </div>');

});

function deleteOrgRow(id){
    var rowId = 'rowId'+id;
    $( "#"+rowId+"").remove();
}

function validate(){
    console.clear()
    var docLength = document.forms["createRede"].length;

    if(regexNomeRede.test(document.forms["createRede"][0].value)){
        boolNomeRede = true;
    }else{
        boolNomeRede = false;
    }

    for(let i = 2; i < docLength - 3; i += 2){
        if(regexNomeOrg.test(document.forms["createRede"][i].value)){
            boolNomeOrg = true;
        }else{
            boolNomeOrg = false;
        }            
    }

    for(let i = 3; i < docLength - 3; i += 2){
        if(document.forms["createRede"][i].value >= 1){
            boolNumOrg = true;
        }else{
            boolNumOrg = false;
        }            
    }

    if(regexNomeCanal.test(document.forms["createRede"][docLength-2].value)){
        boolNomeCanal = true;
    }else{
        boolNomeCanal = false;
    }

    if(boolNomeRede && boolNomeOrg && boolNumOrg && boolNomeCanal){
        document.forms["createRede"].submit();
    
    }else{
    
        if(!boolNomeRede){
            toastr.error('Preencha o nome da rede somente com letras e sem espaços!', 'Erro!')
        }
        if(!boolNomeOrg){
            toastr.error('Preencha o nome da organização sem espaços e começando com uma letra!', 'Erro!')
        }
        if(!boolNumOrg){
            toastr.error('Preencha o número de nós da organização com um valor maior que zero!', 'Erro!')
        }
        if(!boolNomeCanal){
            toastr.error('Preencha o nome do canal somente com letras e sem espaços!', 'Erro!')
        }

    }
}

