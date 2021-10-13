
  const url_string = window.location.href;

  var url = new URL(url_string);
  var result = url.searchParams.get("msg");

  if (result == 'success') {
    toastr.clear()
    toastr.success('Operação realizada com sucesso!', 'Sucesso!')

    document.getElementById('title').innerHTML = "Sucesso"
    document.getElementById('resultado').innerHTML = "A rede foi cadastrada com sucesso" +
    "<div class='row'>"+
        "<div class='col-lg-5'></div>"+
        "<div class='col-lg-2'>"+
            "<a href='/listarRedes' class='btn btn-light'>Listar Redes</a>"    +
        "</div>"+    
        "<div class='col-lg-5'></div>"+   
    "</div>";

  }
  else if (result == 'existFile') {
    toastr.clear()
    toastr.warning('O nome da rede informado já existe!', 'Aviso!')

    document.getElementById('title').innerHTML = "Rede já existe!"
    document.getElementById('resultado').innerHTML = "Favor preencher o formulário novamente <br>" +
        "<div class='row'>"+
            "<div class='col-lg-5'></div>"+
            "<div class='col-lg-2'>"+
                "<a href='/cadastrarRede' class='btn btn-light'>Retornar</a>"    +
            "</div>"+    
            "<div class='col-lg-5'></div>"+   
        "</div>";
  }
  else if (result == 'error'){
    toastr.clear()
    toastr.error('Ocorreu um erro ao realizar a operação!', 'Erro!')

    document.getElementById('title').innerHTML = "Ocorreu um erro"
    document.getElementById('resultado').innerHTML = "Os dados não foram salvos, tente novamente"+
    "<div class='row'>"+
        "<div class='col-lg-5'></div>"+
        "<div class='col-lg-2'>"+
            "<a href='/cadastrarRede' class='btn btn-light'>Retornar</a>"    +
        "</div>"+    
        "<div class='col-lg-5'></div>"+   
    "</div>";
  }